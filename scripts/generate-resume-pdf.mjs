import fs from "node:fs";
import path from "node:path";
import { experiences, profile, resumeSummary, skillCategories } from "../src/data/profile.js";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN_X = 48;
const MARGIN_TOP = 54;
const MARGIN_BOTTOM = 52;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const outputPath = path.resolve("public", "Resume.pdf");
const pages = [];
let currentPage = [];
let y = PAGE_HEIGHT - MARGIN_TOP;

function escapePdfText(value) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function drawText(text, x, yPos, font = "F1", size = 11) {
  currentPage.push(`BT /${font} ${size} Tf 1 0 0 1 ${x} ${yPos} Tm (${escapePdfText(text)}) Tj ET`);
}

function drawLine(x1, y1, x2, y2, width = 1, rgb = [0.52, 0.67, 0.82]) {
  currentPage.push(`${width} w ${rgb[0]} ${rgb[1]} ${rgb[2]} RG ${x1} ${y1} m ${x2} ${y2} l S`);
}

function startPage() {
  currentPage = [];
  y = PAGE_HEIGHT - MARGIN_TOP;
}

function wrapText(text, size, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  const maxChars = Math.max(20, Math.floor(maxWidth / (size * 0.52)));

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars) {
      line = candidate;
    } else {
      if (line) {
        lines.push(line);
      }
      line = word;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
}

function pushPage() {
  pages.push(currentPage);
  startPage();
}

function requireSpace(heightNeeded) {
  if (y - heightNeeded < MARGIN_BOTTOM) {
    pushPage();
  }
}

function addWrappedBlock(text, options = {}) {
  const {
    font = "F1",
    size = 11,
    x = MARGIN_X,
    width = PAGE_WIDTH - MARGIN_X * 2,
    lineHeight = size + 4,
    gapAfter = 8,
  } = options;
  const lines = wrapText(text, size, width);
  requireSpace(lines.length * lineHeight + gapAfter);
  for (const line of lines) {
    drawText(line, x, y, font, size);
    y -= lineHeight;
  }
  y -= gapAfter;
}

function addSectionHeading(text) {
  requireSpace(32);
  drawText(text.toUpperCase(), MARGIN_X, y, "F2", 14);
  y -= 6;
  drawLine(MARGIN_X, y, MARGIN_X + CONTENT_WIDTH, y, 0.9, [0.76, 0.8, 0.86]);
  y -= 18;
}

function addLabelledParagraph(label, value, size = 10, gapAfter = 6) {
  addWrappedBlock(`${label}: ${value}`, {
    font: "F1",
    size,
    lineHeight: size + 4,
    gapAfter,
  });
}

function addBulletList(items, options = {}) {
  const { size = 10, gapAfter = 4 } = options;
  for (const item of items) {
    addWrappedBlock(`- ${item}`, {
      font: "F1",
      size,
      lineHeight: size + 4,
      gapAfter,
    });
  }
}

function buildResumePages() {
  startPage();

  drawText(profile.name, MARGIN_X, y, "F2", 22);
  y -= 30;
  drawText(profile.title, MARGIN_X, y, "F1", 13);
  y -= 22;
  drawText(`${profile.email} | ${profile.location} | github.com/${profile.githubHandle}`, MARGIN_X, y, "F1", 11);
  y -= 14;
  drawLine(MARGIN_X, y, MARGIN_X + CONTENT_WIDTH, y, 1, [0.68, 0.74, 0.82]);
  y -= 18;

  addSectionHeading("Professional Summary");
  addWrappedBlock(resumeSummary, { size: 11, lineHeight: 16, gapAfter: 10 });

  addSectionHeading("Technical Skills");
  for (const category of skillCategories) {
    addLabelledParagraph(category.title, category.items.join(", "));
  }

  addSectionHeading("Core Competencies");
  addBulletList([
    "Full-stack web application development",
    "Responsive frontend implementation",
    "REST API design and backend integration",
    "Database design and query optimization",
    "AI API integration and product features",
    "Cross-functional collaboration and delivery",
  ]);

  addSectionHeading("Experience");
  for (const item of experiences) {
    requireSpace(96);
    drawText(`${item.role} | ${item.company}`, MARGIN_X, y, "F2", 11);
    y -= 16;
    drawText(item.period, MARGIN_X, y, "F1", 10);
    y -= 16;
    addWrappedBlock(item.description, { size: 10, lineHeight: 14, gapAfter: 6 });
    addBulletList(
      item.company === "Mercuryx"
        ? [
            "Build and maintain scalable software systems across planning, development, QA, and deployment.",
            "Support frontend training sessions for junior developers in HTML, CSS, and JavaScript.",
          ]
        : item.company === "Learn2Earn"
        ? [
            "Strengthened backend development fundamentals through focused Golang training.",
            "Practiced building backend logic and understanding API design with Go.",
          ]
        : [
            "Built responsive user interfaces and connected them to backend services and data workflows.",
            "Developed and maintained APIs and application features that improved product reliability and usability.",
          ],
      { size: 10, gapAfter: 4 }
    );
    y -= 4;
    if (item !== experiences[experiences.length - 1]) {
      drawLine(MARGIN_X, y, MARGIN_X + CONTENT_WIDTH, y, 0.6, [0.87, 0.9, 0.94]);
      y -= 12;
    } else {
      y -= 6;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
}

function buildPdf(objects) {
  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [0];

  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(header.length + body.length);
    body += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = header.length + body.length;
  let xref = `xref\n0 ${objects.length + 1}\n`;
  xref += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return `${header}${body}${xref}${trailer}`;
}

buildResumePages();

const pageObjectIds = [];
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [] /Count 0 >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
];

for (const pageCommands of pages) {
  const content = `${pageCommands.join("\n")}\n`;
  const pageObjectId = objects.length + 1;
  const contentObjectId = objects.length + 2;
  pageObjectIds.push(pageObjectId);

  objects.push(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectId} 0 R >>`
  );
  objects.push(`<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}endstream`);
}

objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, buildPdf(objects), "binary");

console.log(`Generated ${outputPath}`);
