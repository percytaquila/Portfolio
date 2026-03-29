// src/utils/generateCV.ts
import jsPDF from "jspdf";

export async function generateCV(data: any) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const W = 210;
  const marginL = 20;
  const marginR = 20;
  const contentW = W - marginL - marginR;
  let y = 0;

  // ── Colores ──
  const BLACK = [15, 17, 23] as [number, number, number];
  const GRAY = [80, 80, 90] as [number, number, number];
  const LIGHT = [130, 130, 140] as [number, number, number];
  const WHITE = [255, 255, 255] as [number, number, number];

  // ── Helpers ──
  function setFont(
    weight: "normal" | "bold" | "italic",
    size: number,
    color = BLACK,
  ) {
    doc.setFont("helvetica", weight);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  }

  function text(str: string, x: number, yPos: number, opts?: any) {
    doc.text(str, x, yPos, opts);
  }

  function line(
    yPos: number,
    color = [220, 220, 225] as [number, number, number],
  ) {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(marginL, yPos, W - marginR, yPos);
  }

  function checkPage(needed: number) {
    if (y + needed > 275) {
      doc.addPage();
      y = 18;
    }
  }

  function sectionTitle(title: string) {
    checkPage(12);
    y += 4;
    setFont("bold", 8, BLACK);
    text(title.toUpperCase(), marginL, y);
    y += 2;
    line(y, BLACK);
    y += 5;
  }

  function bulletLine(txt: string, indent = marginL + 4) {
    const lines = doc.splitTextToSize(`• ${txt}`, contentW - 4);
    checkPage(lines.length * 4.5);
    setFont("normal", 8, GRAY);
    doc.text(lines, indent, y);
    y += lines.length * 4.5;
  }

  // ══════════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════════
  // Fondo header
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, W, 38, "F");

  // Nombre
  y = 14;
  setFont("bold", 20, BLACK);
  text(data.profile.name, W / 2, y, { align: "center" });

  // Contacto
  y = 21;
  setFont("normal", 7.5, BLACK);
  const contact = `${data.profile.location}  ·  ${data.profile.linkedin.replace("https://", "")}  ·  ${data.profile.phone}  ·  ${data.profile.email}`;
  text(contact, W / 2, y, { align: "center" });

  // Línea separadora
  y = 25;
  line(y, BLACK);

  // Summary
  y = 30;
  setFont("italic", 7.5, BLACK);
  const summaryLines = doc.splitTextToSize(data.profile.summary, contentW + 5);
  const lineHeight = 5.5; // ← espacio entre líneas (prueba con 5, 5.5 o 6)
  summaryLines.forEach((line: string) => {
    doc.text(line, W / 2, y, { align: "center" });
    y += lineHeight;
  });
  y = 44;

  // ══════════════════════════════════════════
  // EXPERIENCIA
  // ══════════════════════════════════════════
  sectionTitle("Experiencia Profesional");

  for (const exp of data.experience) {
    checkPage(14);

    // Empresa + ubicación
    setFont("bold", 9, BLACK);
    text(exp.company, marginL, y);
    setFont("normal", 8, BLACK);
    text(exp.location, W - marginR, y, { align: "right" });
    y += 4.5;

    // Rol + período
    setFont("italic", 8, GRAY);
    text(exp.role, marginL, y);
    setFont("italic", 8, LIGHT);
    text(exp.period, W - marginR, y, { align: "right" });
    y += 5;

    // Bullets
    for (const b of exp.bullets) {
      bulletLine(b);
    }

    // Skills chips (texto plano)
    if (exp.skills?.length) {
      checkPage(8);
      setFont("normal", 6.5, LIGHT);
      text("Stack: " + exp.skills.join("  ·  "), marginL + 4, y);
      y += 6;
    }

    y += 2;
  }

  // ══════════════════════════════════════════
  // EDUCACIÓN
  // ══════════════════════════════════════════
  sectionTitle("Educación");

  for (const edu of data.education) {
    checkPage(12);
    setFont("bold", 9, BLACK);
    text(edu.institution, marginL, y);
    setFont("normal", 8, BLACK);
    text(edu.location, W - marginR, y, { align: "right" });
    y += 4.5;
    setFont("italic", 8, GRAY);
    text(edu.degree, marginL, y);
    setFont("normal", 8, LIGHT);
    text(edu.period, W - marginR, y, { align: "right" });
    y += 7;
  }

  // ══════════════════════════════════════════
  // CERTIFICACIONES
  // ══════════════════════════════════════════
  sectionTitle("Certificaciones");

  const allCerts = [
    ...(data.certifications.cloud || []),
    /* ...(data.certifications.offensive || []), */
  ];

  for (const cert of allCerts) {
    checkPage(7);
    setFont("normal", 8, GRAY);
    bulletLine(`${cert.full} (${cert.name})`);
  }

  // ══════════════════════════════════════════
  // SKILLS
  // ══════════════════════════════════════════
  sectionTitle("Tecnologías y Frameworks");

  const skillGroups = [
    { label: "Lenguajes", items: data.skills.languages },
    { label: "Frameworks", items: data.skills.frameworks },
    { label: "Datos & ORM", items: data.skills.data },
    { label: "Cloud & DevOps", items: data.skills.cloud },
    /* { label: "Seguridad", items: data.skills.security }, */
  ];

  for (const group of skillGroups) {
    checkPage(6);
    setFont("bold", 8, BLACK);
    text(`${group.label}: `, marginL, y);
    const labelW = doc.getTextWidth(`${group.label}: `);
    setFont("normal", 8, GRAY);
    const skillsText = doc.splitTextToSize(
      group.items.join("  ·  "),
      contentW - labelW,
    );
    doc.text(skillsText, marginL + labelW, y);
    y += skillsText.length * 4.5 + 1.5;
  }
  doc.save("CV_PercyTaquila.pdf");
}
