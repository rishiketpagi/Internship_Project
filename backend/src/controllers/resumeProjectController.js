// ============================================================
// PDF EXPORT
// ============================================================
export const exportResumePDF = async (req, res) => {
  try {
    if (!req.user.uid) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const { id: projectId } = req.params;

    // Verify ownership
    const projectRef = db.collection(collection).doc(projectId);
    const projectDoc = await projectRef.get();
    if (!projectDoc.exists || projectDoc.data().userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: "Forbidden - project not found or access denied",
      });
    }

    // Check if there's a generated resume or version
    let resumeContent = null;
    let templateId = "classic";

    // Check generated resumes first
    const generatedSnap = await db.collection("generatedResumes")
      .where("projectId", "==", projectId)
      .orderBy("generatedAt", "desc")
      .limit(1)
      .get();

    if (!generatedSnap.empty) {
      const generatedDoc = generatedSnap.docs[0];
      resumeContent = generatedDoc.data().content;
      templateId = generatedDoc.data().templateId || "classic";
    } else {
      // Check resume versions
      const versionsSnap = await db.collection("resumeVersions")
        .where("projectId", "==", projectId)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

      if (!versionsSnap.empty) {
        resumeContent = versionsSnap.docs[0].data().content;
        // Try to determine template from blueprint
        const blueprintSnap = await db.collection("resumeBlueprints").doc(projectId).get();
        if (blueprintSnap.exists) {
          templateId = blueprintSnap.data().sectionOrder?.[0] || "classic";
        }
      }
    }

    if (!resumeContent) {
      return res.status(404).json({
        success: false,
        error: "No resume content found. Generate a resume first.",
      });
    }

    // Generate PDF
    const pdfBuffer = await generateResumePDF(resumeContent, templateId);

    // Create export job record
    const jobId = uuidv4();
    await db.collection("exportJobs").doc(jobId).set({
      projectId,
      type: "pdf",
      status: "completed",
      resultUrl: `resume-exports/${jobId}.pdf`, // In production, use signed URL
      generatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      userId: req.user.uid,
    });

    // Return the PDF as a downloadable response
    // In production, we'd use a signed URL or cloud storage
    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", `attachment; filename="resume-${projectId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Export resume PDF error:", error);

    // Update export job status to failed
    try {
      const { id: projectId } = req.params;
      await db.collection("exportJobs").doc(projectId).update({
        status: "failed",
        error: error.message,
        completedAt: new Date().toISOString(),
      });
    } catch (e) {
      // Ignore - export job tracking is best-effort
    }

    res.status(500).json({
      success: false,
      error: "Failed to export resume PDF",
    });
  }
};

// Get PDF export job status
export const getPDFStatus = async (req, res) => {
  try {
    if (!req.user.uid) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const { id: projectId, jobId } = req.params;

    // Verify ownership
    const projectRef = db.collection(collection).doc(projectId);
    const projectDoc = await projectRef.get();
    if (!projectDoc.exists || projectDoc.data().userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: "Forbidden - project not found or access denied",
      });
    }

    const jobDoc = await db.collection("exportJobs").doc(jobId).get();

    if (!jobDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Export job not found",
      });
    }

    const jobData = jobDoc.data();

    res.json({
      success: true,
      data: {
        projectId,
        jobId,
        status: jobData.status,
        generatedAt: jobData.generatedAt,
        completedAt: jobData.completedAt,
        resultUrl: jobData.resultUrl,
        error: jobData.error,
      },
      error: null,
    });
  } catch (error) {
    console.error("Get PDF status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get PDF export status",
    });
  }
};

// ============================================================
// GET BLUEPRINT
// ============================================================
export const getBlueprint = async (req, res) => {
  try {
    if (!req.user.uid) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const { id: projectId } = req.params;

    // Verify ownership
    const projectRef = db.collection(collection).doc(projectId);
    const projectDoc = await projectRef.get();
    if (!projectDoc.exists || projectDoc.data().userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: "Forbidden - project not found or access denied",
      });
    }

    const blueprintSnap = await db.collection("resumeBlueprints").doc(projectId).get();

    if (!blueprintSnap.exists) {
      return res.status(404).json({
        success: false,
        error: "No blueprint found. Create one first.",
      });
    }

    res.json({
      success: true,
      data: { projectId, blueprint: blueprintSnap.data() },
      error: null,
    });
  } catch (error) {
    console.error("Get blueprint error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get blueprint",
    });
  }
};

// ============================================================
// END OF CONTROLLER
// ============================================================