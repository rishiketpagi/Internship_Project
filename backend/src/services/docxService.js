import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    BorderStyle,
    TableRow,
    TableCell,
    Table,
    WidthType,
} from "docx";

// ── helpers ───────────────────────────────────────────────

const FONT = "Calibri";
const COLOR_HEADING = "1E3A5F";
const COLOR_BODY = "1A1A1A";
const COLOR_MUTED = "555555";

/** Thin horizontal rule paragraph */
function hr() {
    return new Paragraph({
        border: {
            bottom: {
                color: "AAAAAA",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
            },
        },
        spacing: { after: 100 },
    });
}

/** Section heading */
function sectionHeading(text) {
    return new Paragraph({
        children: [
            new TextRun({
                text: text.toUpperCase(),
                bold: true,
                font: FONT,
                size: 22,
                color: COLOR_HEADING,
            }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 80 },
        border: {
            bottom: {
                color: "AAAAAA",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 4,
            },
        },
    });
}

/** Normal body text */
function body(text, { bold = false, italic = false, size = 20, color = COLOR_BODY, spacingAfter = 80 } = {}) {
    return new Paragraph({
        children: [
            new TextRun({ text, bold, italic, font: FONT, size, color }),
        ],
        spacing: { after: spacingAfter },
    });
}

/** Bullet list item */
function bullet(text) {
    return new Paragraph({
        children: [
            new TextRun({ text, font: FONT, size: 20, color: COLOR_BODY }),
        ],
        bullet: { level: 0 },
        spacing: { after: 60 },
    });
}

/** Two-column row: left bold, right muted/right-aligned */
function twoCol(left, right) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideH: { style: BorderStyle.NONE },
            insideV: { style: BorderStyle.NONE },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: left, bold: true, font: FONT, size: 21, color: COLOR_BODY }),
                                ],
                                spacing: { after: 0 },
                            }),
                        ],
                        width: { size: 70, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                        },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: right || "", font: FONT, size: 19, color: COLOR_MUTED }),
                                ],
                                alignment: AlignmentType.RIGHT,
                                spacing: { after: 0 },
                            }),
                        ],
                        width: { size: 30, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                        },
                    }),
                ],
            }),
        ],
        spacing: { after: 0 },
    });
}

/** Gap paragraph */
function gap(size = 100) {
    return new Paragraph({ children: [], spacing: { after: size } });
}

// ── Main export ───────────────────────────────────────────

export async function generateDocxBuffer(resumeData) {
    const {
        personalInfo = {},
        professionalSummary,
        education = [],
        workExperience = [],
        internships = [],
        projects = [],
        skills = [],
        certifications = [],
        achievements = [],
    } = resumeData;

    const children = [];

    // ── Personal Info / Header ───────────────────────────
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: personalInfo.name || "Your Name",
                    bold: true,
                    font: FONT,
                    size: 52,
                    color: COLOR_HEADING,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
        })
    );

    // Contact line
    const contactParts = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.location,
        personalInfo.linkedin,
        personalInfo.github,
        personalInfo.portfolio,
    ].filter(Boolean);

    if (contactParts.length > 0) {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: contactParts.join("  |  "),
                        font: FONT,
                        size: 18,
                        color: COLOR_MUTED,
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 160 },
            })
        );
    }

    children.push(hr());

    // ── Professional Summary ─────────────────────────────
    if (professionalSummary) {
        children.push(sectionHeading("Professional Summary"));
        children.push(body(professionalSummary, { spacingAfter: 120 }));
    }

    // ── Work Experience ──────────────────────────────────
    if (workExperience.length > 0) {
        children.push(sectionHeading("Work Experience"));
        for (const exp of workExperience) {
            const dateStr = [exp.startDate, exp.endDate].filter(Boolean).join(" – ");
            children.push(twoCol(exp.jobTitle || "", dateStr));
            children.push(body(`${exp.company || ""}${exp.location ? " · " + exp.location : ""}`, { italic: true, color: COLOR_MUTED, spacingAfter: 60 }));
            if (exp.description) children.push(body(exp.description, { spacingAfter: 60 }));
            for (const r of (exp.responsibilities || [])) children.push(bullet(r));
            children.push(gap(100));
        }
    }

    // ── Internships ──────────────────────────────────────
    if (internships.length > 0) {
        children.push(sectionHeading("Internships"));
        for (const exp of internships) {
            const dateStr = [exp.startDate, exp.endDate].filter(Boolean).join(" – ");
            children.push(twoCol(exp.jobTitle || "", dateStr));
            children.push(body(`${exp.company || ""}${exp.location ? " · " + exp.location : ""}`, { italic: true, color: COLOR_MUTED, spacingAfter: 60 }));
            if (exp.description) children.push(body(exp.description, { spacingAfter: 60 }));
            for (const r of (exp.responsibilities || [])) children.push(bullet(r));
            children.push(gap(100));
        }
    }

    // ── Projects ─────────────────────────────────────────
    if (projects.length > 0) {
        children.push(sectionHeading("Projects"));
        for (const proj of projects) {
            const techStr = (proj.technologies || []).join(", ");
            children.push(twoCol(proj.name || "", techStr));
            if (proj.url) children.push(body(proj.url, { italic: true, color: COLOR_MUTED, spacingAfter: 40 }));
            if (proj.description) children.push(body(proj.description, { spacingAfter: 60 }));
            children.push(gap(80));
        }
    }

    // ── Education ────────────────────────────────────────
    if (education.length > 0) {
        children.push(sectionHeading("Education"));
        for (const edu of education) {
            const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(" – ");
            children.push(twoCol(edu.institution || "", dateStr));
            const degreeStr = [edu.degree, edu.field ? `in ${edu.field}` : null]
                .filter(Boolean).join(" ");
            children.push(body(degreeStr, { spacingAfter: 40 }));
            if (edu.grade) children.push(body(`Grade: ${edu.grade}`, { color: COLOR_MUTED, spacingAfter: 40 }));
            children.push(gap(80));
        }
    }

    // ── Skills ───────────────────────────────────────────
    if (skills.length > 0) {
        children.push(sectionHeading("Skills"));
        children.push(body(skills.join("  ·  "), { spacingAfter: 120 }));
    }

    // ── Certifications ───────────────────────────────────
    if (certifications.length > 0) {
        children.push(sectionHeading("Certifications"));
        for (const cert of certifications) {
            const text = cert.issuer ? `${cert.name} — ${cert.issuer}` : cert.name;
            children.push(bullet(text));
        }
        children.push(gap(80));
    }

    // ── Achievements ─────────────────────────────────────
    if (achievements.length > 0) {
        children.push(sectionHeading("Achievements"));
        for (const ach of achievements) {
            children.push(bullet(typeof ach === "string" ? ach : String(ach)));
        }
    }

    // ── Build & return ───────────────────────────────────
    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 720,    // 0.5 inch
                            bottom: 720,
                            left: 900,   // 0.625 inch
                            right: 900,
                        },
                    },
                },
                children,
            },
        ],
        styles: {
            default: {
                document: {
                    run: { font: FONT, size: 20, color: COLOR_BODY },
                },
            },
        },
    });

    return Packer.toBuffer(doc);
}
