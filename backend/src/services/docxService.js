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

    const experiences = [...workExperience, ...internships];

    const sectionGenerators = {
        experience: () => {
            const els = [];
            if (experiences.length > 0) {
                els.push(sectionHeading("Work Experience"));
                for (const exp of experiences) {
                    const dateStr = [exp.startDate, exp.endDate].filter(Boolean).join(" – ");
                    els.push(twoCol(exp.jobTitle || "", dateStr));
                    els.push(body(`${exp.company || ""}${exp.location ? " · " + exp.location : ""}`, { italic: true, color: COLOR_MUTED, spacingAfter: 60 }));
                    if (exp.description) els.push(body(exp.description, { spacingAfter: 60 }));
                    for (const r of (exp.responsibilities || [])) els.push(bullet(r));
                    els.push(gap(100));
                }
            }
            return els;
        },
        projects: () => {
            const els = [];
            if (projects.length > 0) {
                els.push(sectionHeading("Projects"));
                for (const proj of projects) {
                    const techStr = (proj.technologies || []).join(", ");
                    els.push(twoCol(proj.name || "", techStr));
                    if (proj.url) els.push(body(proj.url, { italic: true, color: COLOR_MUTED, spacingAfter: 40 }));
                    if (proj.description) els.push(body(proj.description, { spacingAfter: 60 }));
                    els.push(gap(80));
                }
            }
            return els;
        },
        education: () => {
            const els = [];
            if (education.length > 0) {
                els.push(sectionHeading("Education"));
                for (const edu of education) {
                    const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(" – ");
                    els.push(twoCol(edu.institution || "", dateStr));
                    const degreeStr = [edu.degree, edu.field ? `in ${edu.field}` : null].filter(Boolean).join(" ");
                    els.push(body(degreeStr, { spacingAfter: 40 }));
                    if (edu.grade) els.push(body(`Grade: ${edu.grade}`, { color: COLOR_MUTED, spacingAfter: 40 }));
                    els.push(gap(80));
                }
            }
            return els;
        },
        skills: () => {
            const els = [];
            if (skills.length > 0) {
                const skillsText = skills.map(s => typeof s === "string" ? s : s.name || "").filter(Boolean).join("  ·  ");
                els.push(sectionHeading("Skills"));
                els.push(body(skillsText, { spacingAfter: 120 }));
            }
            return els;
        },
        certifications: () => {
            const els = [];
            if (certifications.length > 0) {
                els.push(sectionHeading("Certifications"));
                for (const cert of certifications) {
                    const certName = typeof cert === "string" ? cert : cert.name || "";
                    const certIssuer = typeof cert === "string" ? "" : cert.issuer || "";
                    const text = certIssuer ? `${certName} — ${certIssuer}` : certName;
                    if (text) els.push(bullet(text));
                }
                els.push(gap(80));
            }
            return els;
        },
        achievements: () => {
            const els = [];
            if (achievements.length > 0) {
                els.push(sectionHeading("Achievements"));
                for (const ach of achievements) {
                    els.push(bullet(typeof ach === "string" ? ach : String(ach.name || ach)));
                }
            }
            return els;
        }
    };

    const DEFAULT_ORDER = ["education", "experience", "projects", "skills", "certifications", "achievements"];
    const sectionOrder = resumeData.sectionOrder && resumeData.sectionOrder.length > 0 
        ? resumeData.sectionOrder 
        : DEFAULT_ORDER;

    for (const key of sectionOrder) {
        if (sectionGenerators[key]) {
            const els = sectionGenerators[key]();
            children.push(...els);
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
