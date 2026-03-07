"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Download, RefreshCw, Palette, ChevronDown, ChevronUp, ZoomIn } from "lucide-react";

type FieldType = "text" | "textarea" | "color" | "image" | "select";
interface Field { key: string; label: string; type: FieldType; default: string; placeholder?: string; options?: string[]; }
interface LogoOpts { size: number; ox: number; oy: number; }
interface Template {
  id: string; label: string; emoji: string; category: string;
  width: number; height: number; hasAvatar: boolean; fields: Field[];
  draw: (ctx: CanvasRenderingContext2D, values: Record<string, string>, photos: Record<string, HTMLImageElement | null>, photoZoom: number, photoAlignX: number, photoAlignY: number, logoImg: HTMLImageElement | null) => void;
}
// Module-level logo options – set before each draw call so helpers can read it
let _logoOpts: LogoOpts = { size: 1, ox: 0, oy: 0 };

// ── Draw helpers ─────────────────────────────────────────────────────────────
function imgCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, zoom = 1, ax = 0.5, ay = 0.5) {
  const s = Math.max(w / img.width, h / img.height) * zoom;
  const dw = img.width * s, dh = img.height * s;
  const ox = x + (w - dw) * ax, oy = y + (h - dh) * ay;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.drawImage(img, ox, oy, dw, dh); ctx.restore();
}
function imgCircle(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, cx: number, cy: number, r: number, zoom = 1, ax = 0.5, ay = 0.5) {
  ctx.save(); ctx.shadowColor = "rgba(80,200,255,0.65)"; ctx.shadowBlur = 48;
  ctx.beginPath(); ctx.arc(cx, cy, r + 12, 0, Math.PI * 2); ctx.strokeStyle = "rgba(100,200,255,0.28)"; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cy, r + 10, 0, Math.PI * 2); ctx.fillStyle = "#ffffff"; ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  if (img) {
    const side = r * 2, s = Math.max(side / img.width, side / img.height) * zoom;
    const dw = img.width * s, dh = img.height * s;
    ctx.drawImage(img, cx - r + (side - dw) * ax, cy - r + (side - dh) * ay, dw, dh);
  } else {
    ctx.fillStyle = "#0a1e42"; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.font = `${r * 0.9}px Arial`; ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("👤", cx, cy); ctx.textBaseline = "alphabetic";
  }
  ctx.restore();
}
function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}
function wrapL(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number): number {
  ctx.textAlign = "left"; const words = text.split(" "); let line = "", curY = y;
  for (const w of words) { const t = line + (line ? " " : "") + w; if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, curY); line = w; curY += lh; } else line = t; }
  if (line) { ctx.fillText(line, x, curY); curY += lh; } return curY;
}
function wrapC(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, maxW: number, lh: number): number {
  ctx.textAlign = "center"; const words = text.split(" "); let line = "", curY = y;
  for (const w of words) { const t = line + (line ? " " : "") + w; if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, cx, curY); line = w; curY += lh; } else line = t; }
  if (line) { ctx.fillText(line, cx, curY); curY += lh; } return curY;
}
function neonLine(ctx: CanvasRenderingContext2D, W: number, y: number, c = "rgba(100,160,255,0.5)") {
  const g = ctx.createLinearGradient(0, y, W, y);
  g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.2, c); g.addColorStop(0.8, c); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save(); ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); ctx.restore();
}
function drawLogoBar(ctx: CanvasRenderingContext2D, W: number, logoImg: HTMLImageElement | null, barH = 90) {
  ctx.fillStyle = "rgba(255,255,255,0.97)"; ctx.fillRect(0, 0, W, barH);
  ctx.fillStyle = "rgba(0,0,0,0.1)"; ctx.fillRect(0, barH - 2, W, 2);
  const cy = barH / 2;
  const lw = 64 * _logoOpts.size, lh = 64 * _logoOpts.size;
  if (logoImg) ctx.drawImage(logoImg, 18 + _logoOpts.ox, cy - lh / 2 + _logoOpts.oy, lw, lh);
  const tx = logoImg ? (18 + _logoOpts.ox + lw + 10) : 22;
  ctx.font = "bold 22px Arial"; ctx.fillStyle = "#1a3a6e"; ctx.textAlign = "left"; ctx.fillText("Daffodil", tx, cy - 4);
  ctx.font = "bold 18px Arial"; ctx.fillStyle = "#1a3a6e"; ctx.fillText("International University", tx, cy + 18);
  ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(W / 2 - 1, 12, 2, barH - 24);
  ctx.font = "bold 24px Arial"; ctx.fillStyle = "#1a3a6e"; ctx.fillText("ROBOTICS CLUB", W / 2 + 16, cy - 2);
  ctx.font = "bold 13px Arial"; ctx.fillStyle = "#2563ab"; ctx.fillText("DAFFODIL INTERNATIONAL UNIVERSITY", W / 2 + 16, cy + 20);
}
function drawBottomLogoBar(ctx: CanvasRenderingContext2D, W: number, H: number, logoImg: HTMLImageElement | null, barH = 90) {
  ctx.fillStyle = "rgba(255,255,255,0.97)"; ctx.fillRect(0, H - barH, W, barH);
  ctx.fillStyle = "rgba(0,0,0,0.1)"; ctx.fillRect(0, H - barH, W, 2);
  const by = H - barH, cy = by + barH / 2;
  const lw = 60 * _logoOpts.size, lh = 60 * _logoOpts.size;
  if (logoImg) ctx.drawImage(logoImg, 18 + _logoOpts.ox, cy - lh / 2 + _logoOpts.oy, lw, lh);
  const tx = logoImg ? (18 + _logoOpts.ox + lw + 10) : 22;
  ctx.font = "bold 20px Arial"; ctx.fillStyle = "#1a3a6e"; ctx.textAlign = "left"; ctx.fillText("Daffodil", tx, cy - 3);
  ctx.font = "bold 16px Arial"; ctx.fillStyle = "#1a3a6e"; ctx.fillText("International University", tx, cy + 17);
  ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(W / 2 - 1, by + 12, 2, barH - 24);
  ctx.font = "bold 22px Arial"; ctx.fillStyle = "#1a3a6e"; ctx.fillText("ROBOTICS CLUB", W / 2 + 16, cy - 2);
  ctx.font = "bold 12px Arial"; ctx.fillStyle = "#2563ab"; ctx.fillText("DAFFODIL INTERNATIONAL UNIVERSITY", W / 2 + 16, cy + 18);
}
function drawTornPaper(ctx: CanvasRenderingContext2D, endY: number) {
  const rE = 1080 * 0.598;
  const pts: [number, number][] = [
    [0, 0], [rE, 0],
    [rE + 22, 36], [rE - 18, 72], [rE + 24, 108], [rE - 14, 144],
    [rE + 20, 180], [rE - 20, 216], [rE + 24, 252], [rE - 16, 288],
    [rE + 22, 324], [rE - 18, 360], [rE + 24, 396], [rE - 14, 432],
    [rE + 20, 468], [rE - 20, 504], [rE + 24, 540], [rE + 20, endY],
    [0, endY],
  ];
  ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.32)"; ctx.shadowBlur = 28; ctx.shadowOffsetX = 12;
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (const [x, y] of pts) ctx.lineTo(x, y);
  ctx.closePath(); ctx.fillStyle = "#eef2ff"; ctx.fill(); ctx.restore();
}
function drawBeams(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const cx = W / 2, cy = H + 200, count = 18, spread = Math.PI * 1.05, offset = Math.PI - spread / 2;
  for (let i = 0; i < count; i++) {
    const a1 = offset + (i / count) * spread, a2 = offset + ((i + 0.45) / count) * spread, r = H * 2.2;
    ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
    ctx.lineTo(cx + Math.cos(a2) * r, cy + Math.sin(a2) * r);
    ctx.closePath(); ctx.fillStyle = i % 2 === 0 ? "rgba(60,140,255,0.07)" : "rgba(40,90,200,0.04)"; ctx.fill(); ctx.restore();
  }
}
function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4);
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.strokeRect(-size / 2, -size / 2, size, size); ctx.restore();
}
function drawScanLines(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save(); ctx.fillStyle = "rgba(80,110,255,0.055)";
  for (let ly = y; ly < y + h; ly += 10) ctx.fillRect(x, ly, w, 1.5); ctx.restore();
}

// ── Templates ─────────────────────────────────────────────────────────────────
const TEMPLATES: Template[] = [
  // 1. Executive Member Card
  {
    id: "member-card", label: "🏅 Executive Member Card", emoji: "🏅", category: "Membership",
    width: 1080, height: 1350, hasAvatar: true,
    fields: [
      { key: "name", label: "Member Name", type: "text", default: "Jabed Shariar" },
      { key: "role", label: "Role", type: "text", default: "Mentor" },
      { key: "committee", label: "Committee / Year", type: "text", default: "Executive Committee 2026" },
      { key: "bgColor1", label: "BG Color 1", type: "color", default: "#020c22" },
      { key: "bgColor2", label: "BG Color 2", type: "color", default: "#0a2060" },
      { key: "accentColor", label: "Accent Color", type: "color", default: "#00b4d8" },
      { key: "avatar", label: "Profile Photo", type: "image", default: "" },
    ],
    draw(ctx, v, photos, zoom, ax, ay, logoImg) {
      const W = this.width, H = this.height, avatarImg = photos["avatar"];
      const accent = v.accentColor || "#00b4d8";
      // BG
      const bgG = ctx.createLinearGradient(0, 0, W, H);
      bgG.addColorStop(0, v.bgColor1 || "#020c22"); bgG.addColorStop(0.55, v.bgColor2 || "#0a2060"); bgG.addColorStop(1, v.bgColor1 || "#020c22");
      ctx.fillStyle = bgG; ctx.fillRect(0, 0, W, H);
      drawBeams(ctx, W, H);
      // Vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H);
      vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
      drawLogoBar(ctx, W, logoImg, 90);
      // "Daffodil International University"
      ctx.font = "italic 30px Georgia"; ctx.fillStyle = "rgba(255,255,255,0.82)"; ctx.textAlign = "center"; ctx.fillText("Daffodil International University", W / 2, 168);
      // "ROBOTICS CLUB"
      ctx.save(); ctx.font = "bold 100px Arial"; ctx.fillStyle = accent; ctx.textAlign = "center"; ctx.shadowColor = accent; ctx.shadowBlur = 22; ctx.fillText("ROBOTICS CLUB", W / 2, 290); ctx.restore();
      // Committee
      ctx.font = "italic 38px Georgia"; ctx.fillStyle = "rgba(255,255,255,0.78)"; ctx.textAlign = "center"; ctx.fillText(v.committee || "Executive Committee 2026", W / 2, 360);
      neonLine(ctx, W, 388, `${accent}99`);
      // Diamonds
      drawDiamond(ctx, 100, H * 0.43, 44, `${accent}90`); drawDiamond(ctx, W - 100, H * 0.43, 44, `${accent}90`);
      drawDiamond(ctx, 70, H * 0.54, 26, `${accent}60`); drawDiamond(ctx, W - 70, H * 0.54, 26, `${accent}60`);
      ctx.save(); ctx.font = "26px Arial"; ctx.textAlign = "center";
      ["rgba(200,240,255,0.85)", "rgba(200,240,255,0.5)"].forEach((c, ci) => {
        ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 8;
        ctx.fillText("✦", ci === 0 ? 138 : 68, H * (ci === 0 ? 0.40 : 0.51));
        ctx.fillText("✦", ci === 0 ? W - 138 : W - 68, H * (ci === 0 ? 0.40 : 0.51));
      }); ctx.restore();
      // Avatar circle
      const circleY = H * 0.515;
      imgCircle(ctx, avatarImg, W / 2, circleY, 210, zoom, ax, ay);
      // Role
      const belowY = circleY + 210 + 10;
      ctx.save(); ctx.font = "italic bold 58px Georgia"; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.shadowColor = `${accent}99`; ctx.shadowBlur = 12;
      ctx.fillText(v.role || "Role", W / 2, belowY + 72); ctx.restore();
      // Name
      ctx.font = "bold 60px Arial"; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(v.name || "Name", W / 2, belowY + 148);
      neonLine(ctx, W, H - 68, `${accent}88`);
      ctx.font = "22px Arial"; ctx.fillStyle = `${accent}cc`; ctx.textAlign = "center"; ctx.fillText("diu-rc-new.vercel.app", W / 2, H - 30);
    },
  },

  // 3. Champions / Achievement
  {
    id: "champions", label: "🏆 Champions / Achievement", emoji: "🏆", category: "Achievement",
    width: 1080, height: 1080, hasAvatar: true,
    fields: [
      { key: "teamName", label: "Team / Award Name", type: "text", default: "TEAM DARKTRACE3" },
      { key: "achievement", label: "Achievement Description", type: "textarea", default: "H.M. Ashis Rahman, Md. Kawsher Ahmed & Shafiur Rahman, became Champions of Cyber Security Awareness Day 2026 (Project Showcasing Category)" },
      { key: "highlightWord", label: "Highlight Word (gold)", type: "text", default: "Champions" },
      { key: "bgColor", label: "Background Color", type: "color", default: "#050815" },
      { key: "eventPhoto", label: "Event / Group Photo", type: "image", default: "" },
    ],
    draw(ctx, v, photos, zoom, ax, ay, logoImg) {
      const W = this.width, H = this.height, eventPhoto = photos["eventPhoto"], bg = v.bgColor || "#050815";
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      // Event photo top 52%
      const photoH = H * 0.52;
      if (eventPhoto) {
        imgCover(ctx, eventPhoto, 0, 0, W, photoH, zoom, ax, ay);
      } else {
        ctx.fillStyle = "#0a1230"; ctx.fillRect(0, 0, W, photoH);
        ctx.font = "52px Arial"; ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillText("📸 Upload Event Photo", W / 2, photoH / 2 + 18);
      }
      // Fade photo into dark
      const fadeG = ctx.createLinearGradient(0, photoH * 0.55, 0, photoH + 20);
      fadeG.addColorStop(0, "rgba(5,8,21,0)"); fadeG.addColorStop(1, bg);
      ctx.fillStyle = fadeG; ctx.fillRect(0, photoH * 0.55, W, photoH * 0.45 + 20);
      ctx.fillStyle = bg; ctx.fillRect(0, photoH, W, H - photoH);
      drawScanLines(ctx, 0, photoH, W, H - photoH);
      neonLine(ctx, W, photoH + 2, "rgba(80,110,255,0.6)"); neonLine(ctx, W, photoH + 6, "rgba(80,110,255,0.25)");
      // Team name glowing
      const teamName = v.teamName || "TEAM NAME";
      ctx.save(); ctx.font = "bold 108px Impact, Arial Black, Arial"; ctx.textAlign = "center";
      ctx.shadowColor = "rgba(255,255,255,0.85)"; ctx.shadowBlur = 55; ctx.fillStyle = "rgba(255,255,255,0.32)"; ctx.fillText(teamName, W / 2, H * 0.735);
      ctx.shadowBlur = 20; ctx.fillStyle = "#ffffff"; ctx.fillText(teamName, W / 2, H * 0.735); ctx.restore();
      // Achievement text with highlight
      const achText = v.achievement || "", highlight = (v.highlightWord || "").trim();
      ctx.font = "bold 26px Arial";
      const words = achText.split(" "); const lines: string[] = []; let cur = "";
      for (const wd of words) { const t = cur + (cur ? " " : "") + wd; if (ctx.measureText(t).width > W - 120 && cur) { lines.push(cur); cur = wd; } else cur = t; }
      if (cur) lines.push(cur);
      let ly = H * 0.795;
      for (const line of lines) {
        if (highlight && line.includes(highlight)) {
          const bef = line.substring(0, line.indexOf(highlight)), aft = line.substring(line.indexOf(highlight) + highlight.length);
          const totW = ctx.measureText(line).width, sx = W / 2 - totW / 2;
          ctx.textAlign = "left"; ctx.fillStyle = "rgba(255,255,255,0.88)"; ctx.fillText(bef, sx, ly);
          const befW = ctx.measureText(bef).width;
          ctx.fillStyle = "#ffd700"; ctx.save(); ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 8; ctx.fillText(highlight, sx + befW, ly); ctx.restore();
          ctx.fillStyle = "rgba(255,255,255,0.88)"; ctx.fillText(aft, sx + befW + ctx.measureText(highlight).width, ly);
        } else { ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.88)"; ctx.fillText(line, W / 2, ly); }
        ly += 40;
      }
      drawBottomLogoBar(ctx, W, H, logoImg, 90);
    },
  },

  // 4. Recruitment Poster
  {
    id: "recruitment", label: "📢 Recruitment Poster", emoji: "📢", category: "Recruitment",
    width: 1080, height: 1350, hasAvatar: false,
    fields: [
      { key: "committeeTitle", label: "Committee Title", type: "text", default: "Executive Committee 2026" },
      { key: "bgColor1", label: "Sky Color Top", type: "color", default: "#b8e0f7" },
      { key: "bgColor2", label: "Sky Color Bottom", type: "color", default: "#cdd0f0" },
      { key: "positions", label: "Positions (one per line)", type: "textarea", default: "President\nGeneral Secretary\nVice President\nTreasurer\nJoint Secretary\nOrganizing Secretary\nTraining Secretary\nPress Secretary\nCommunication Secretary\nLead Designer\nVideo Editor\nExecutive" },
      { key: "whyJoin", label: "Why Join (one per line)", type: "textarea", default: "Gain hands-on experience in robotics and technology\nDevelop leadership and teamwork skills\nParticipate in competitions, workshops, and events\nContribute, innovate, and build a lasting legacy at DIU" },
      { key: "specialNote", label: "Special Note", type: "textarea", default: "Special Note: 1-Year Club Committee Membership Experience and 1 year studentship is mandatory for major positions such as [President, Vice President, General Secretary, and Treasurer]." },
      { key: "deadline", label: "Deadline Date", type: "text", default: "15 January 2026" },
      { key: "applyLink", label: "Apply Link", type: "text", default: "diu-rc-new.vercel.app/join" },
      { key: "footerNote", label: "Footer Note", type: "text", default: "All rights of conducting, modifying, or changing any rules or positions are reserved by DIURC." },
    ],
    draw(ctx, v, _p, _z, _ax, _ay, logoImg) {
      const W = this.width, H = this.height;
      // Sky
      const skyG = ctx.createLinearGradient(0, 0, W, H);
      skyG.addColorStop(0, v.bgColor1 || "#b8e0f7"); skyG.addColorStop(0.5, "#d0e8f5"); skyG.addColorStop(1, v.bgColor2 || "#cdd0f0");
      ctx.fillStyle = skyG; ctx.fillRect(0, 0, W, H);
      // Clouds
      const cloud = (cx: number, cy: number, rx: number, ry: number) => { ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.38)"; ctx.fill(); ctx.restore(); };
      cloud(W * 0.12, 230, 210, 80); cloud(W * 0.78, 170, 240, 75); cloud(W * 0.5, 320, 170, 55); cloud(W * 0.25, 380, 100, 38);
      drawLogoBar(ctx, W, logoImg, 88);
      // Illustration
      ctx.textAlign = "center";
      ctx.font = "100px Arial"; ctx.fillText("🤖", W / 2 - 180, 310);
      ctx.font = "65px Arial"; ctx.fillText("⚡", W / 2 + 210, 220); ctx.fillText("🔬", W / 2 + 310, 330); ctx.fillText("💡", W / 2 - 330, 220); ctx.fillText("🖥️", W / 2 + 120, 380); ctx.fillText("🔧", W / 2 - 160, 390);
      ctx.font = "40px Arial"; ctx.fillText("⚙️", W / 2 + 40, 170); ctx.fillText("📡", W / 2 - 60, 165);
      ctx.fillStyle = "rgba(80,150,240,0.2)"; ctx.beginPath(); ctx.arc(W * 0.14, H * 0.27, 55, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(140,90,255,0.15)"; ctx.beginPath(); ctx.arc(W * 0.85, H * 0.32, 40, 0, Math.PI * 2); ctx.fill();
      // Title
      ctx.font = "bold 38px Arial"; ctx.fillStyle = "#0284c7"; ctx.textAlign = "center"; ctx.fillText(v.committeeTitle || "Executive Committee 2026", W / 2, 470);
      // "Recruitment"
      ctx.save(); ctx.font = "bold 96px Arial"; ctx.fillStyle = "#1e3a8a"; ctx.textAlign = "center"; ctx.shadowColor = "rgba(0,0,0,0.1)"; ctx.shadowBlur = 8; ctx.fillText("Recruitment", W / 2, 580); ctx.restore();
      // White content panel
      const panelY = 610, panelH = H - panelY - 120;
      ctx.fillStyle = "rgba(255,255,255,0.90)"; rrect(ctx, 40, panelY, W - 80, panelH, 22); ctx.fill();
      const colPad = 76, panelTextY = panelY + 50;
      // Positions
      ctx.save(); ctx.font = "bold 30px Arial"; ctx.fillStyle = "#0284c7"; ctx.textAlign = "left"; ctx.fillText("Positions list:", colPad, panelTextY); ctx.restore();
      const positions = (v.positions || "").split("\n").filter(Boolean);
      ctx.font = "22px Arial"; ctx.fillStyle = "#1e293b"; let posY = panelTextY + 40;
      positions.forEach((pos) => { ctx.textAlign = "left"; ctx.fillText(`• ${pos}`, colPad, posY); posY += 34; });
      // Why Join
      const col2X = W / 2 + 10;
      ctx.save(); ctx.font = "bold 28px Arial"; ctx.fillStyle = "#0284c7"; ctx.textAlign = "left"; ctx.fillText("Why Join DIU Robotics Club!", col2X, panelTextY); ctx.restore();
      const whyItems = (v.whyJoin || "").split("\n").filter(Boolean);
      ctx.font = "20px Arial"; ctx.fillStyle = "#1e293b"; let whyY = panelTextY + 40;
      for (const item of whyItems) { whyY = wrapL(ctx, `• ${item}`, col2X, whyY, W / 2 - colPad - 10, 24); whyY += 6; }
      // Special note
      const noteY = Math.max(posY, whyY) + 14;
      if (v.specialNote) { ctx.save(); ctx.font = "italic 19px Arial"; ctx.fillStyle = "#475569"; wrapL(ctx, v.specialNote, colPad, noteY, W - colPad * 2, 24); ctx.restore(); }
      // APPLY button
      const btnY = panelY + panelH - 100;
      ctx.fillStyle = "#1d4ed8"; rrect(ctx, W - 270, btnY, 200, 58, 10); ctx.fill();
      ctx.save(); ctx.font = "bold 32px Arial"; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText("APPLY", W - 170, btnY + 38); ctx.restore();
      ctx.font = "20px Arial"; ctx.fillStyle = "#0284c7"; ctx.textAlign = "left"; ctx.fillText(`🔗 ${v.applyLink || "diu-rc-new.vercel.app/join"}`, colPad, btnY + 40);
      // Deadline
      ctx.font = "bold 30px Arial"; ctx.fillStyle = "#1e3a8a"; ctx.textAlign = "left"; ctx.fillText(`Deadline: ${v.deadline || "—"}`, colPad, panelY + panelH + 44);
      ctx.font = "italic 18px Arial"; ctx.fillStyle = "#334155"; wrapL(ctx, v.footerNote || "", colPad, panelY + panelH + 80, W - colPad * 2, 22);
    },
  },

  // 5. Seminar / Event
  {
    id: "seminar", label: "📣 Seminar / Event", emoji: "📣", category: "Events",
    width: 1080, height: 1080, hasAvatar: false,
    fields: [
      { key: "title", label: "Event Title", type: "text", default: "AI & Robotics Seminar 2026" },
      { key: "subtitle", label: "Tagline", type: "text", default: "Exploring the Future of Intelligent Automation" },
      { key: "date", label: "Date", type: "text", default: "March 15, 2026" },
      { key: "time", label: "Time", type: "text", default: "10:00 AM – 2:00 PM" },
      { key: "venue", label: "Venue", type: "text", default: "DIU Permanent Campus, Ashulia" },
      { key: "speaker", label: "Guest Speaker", type: "text", default: "Dr. Md. Sabur Khan" },
      { key: "bgColor1", label: "BG Color 1", type: "color", default: "#0f172a" },
      { key: "bgColor2", label: "BG Color 2", type: "color", default: "#1e40af" },
    ],
    draw(ctx, v, _p, _z, _ax, _ay, logoImg) {
      const W = this.width, H = this.height;
      const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, v.bgColor1 || "#0f172a"); g.addColorStop(1, v.bgColor2 || "#1e40af"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      [{ x: 0, y: 0, r: 140 }, { x: W, y: H, r: 180 }].forEach(({ x, y, r }) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fill(); });
      drawLogoBar(ctx, W, logoImg, 90);
      ctx.font = "68px Arial"; ctx.textAlign = "center"; ctx.fillText("🤖⚡🔬", W / 2, 194);
      ctx.font = "bold 34px Arial"; ctx.fillStyle = "#93c5fd"; ctx.textAlign = "center"; ctx.fillText("DIU Robotics Club Presents", W / 2, 232);
      neonLine(ctx, W, 252, "rgba(147,197,253,0.45)");
      ctx.save(); ctx.font = "bold 62px Arial"; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.shadowColor = "rgba(59,130,246,0.8)"; ctx.shadowBlur = 22; wrapC(ctx, v.title || "Event Title", W / 2, 330, 860, 72); ctx.restore();
      ctx.font = "italic 30px Arial"; ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.textAlign = "center"; wrapC(ctx, v.subtitle || "", W / 2, 462, 820, 40);
      const rows = [{ i: "📅", l: "Date", val: v.date }, { i: "⏰", l: "Time", val: v.time }, { i: "📍", l: "Venue", val: v.venue }, ...(v.speaker ? [{ i: "🎤", l: "Speaker", val: v.speaker }] : [])];
      let ry = 562;
      rows.forEach(({ i, l, val }) => {
        ctx.fillStyle = "rgba(255,255,255,0.07)"; rrect(ctx, 100, ry, W - 200, 64, 14); ctx.fill();
        ctx.font = "bold 28px Arial"; ctx.fillStyle = "#93c5fd"; ctx.textAlign = "left"; ctx.fillText(`${i}  ${l}:`, 135, ry + 40);
        ctx.font = "28px Arial"; ctx.fillStyle = "#fff"; ctx.textAlign = "right"; ctx.fillText(val || "—", W - 135, ry + 40); ry += 80;
      });
      ctx.fillStyle = "#2563eb"; rrect(ctx, W / 2 - 230, H - 140, 460, 68, 34); ctx.fill();
      ctx.font = "bold 28px Arial"; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText("Register Now → diu-rc-new.vercel.app", W / 2, H - 96);
      ctx.font = "20px Arial"; ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fillText("DIU Robotics Club  |  Daffodil International University", W / 2, H - 42);
    },
  },

  // 6. Workshop
  {
    id: "workshop", label: "🛠️ Workshop", emoji: "🛠️", category: "Events",
    width: 1080, height: 1600, hasAvatar: true,
    fields: [
      { key: "eventType", label: "Event Type", type: "select", default: "Workshop", options: ["Workshop", "Seminar", "Event", "Bootcamp"] },
      { key: "title", label: "Title", type: "text", default: "Arduino Robotics Bootcamp" },
      { key: "topic", label: "What You'll Learn", type: "textarea", default: "Arduino programming, servo control, sensor integration, line-following robots, and obstacle avoidance." },
      { key: "date", label: "Date", type: "text", default: "March 20–22, 2026" },
      { key: "duration", label: "Duration", type: "text", default: "3 Days (6 hrs/day)" },
      { key: "venue", label: "Venue", type: "text", default: "DIU Lab 501, Permanent Campus" },
      { key: "fee", label: "Fee", type: "text", default: "Free for Members / ৳200 Others" },
      { key: "deadline", label: "Deadline", type: "text", default: "March 18, 2026" },
      { key: "guestName", label: "Guest Speaker (Optional)", type: "text", default: "" },
      { key: "guestPosition", label: "Guest Position (Optional)", type: "text", default: "" },
      { key: "guestImage", label: "Guest Photo (Optional)", type: "image", default: "" },
      { key: "regLink", label: "Registration Link", type: "text", default: "https://diu-rc-new.vercel.app/register" },
      { key: "bgColor1", label: "BG Dark Color", type: "color", default: "#0c0f1e" },
      { key: "bgColor2", label: "BG Mid Color", type: "color", default: "#0f2040" },
      { key: "accentColor", label: "Theme Accent Color", type: "color", default: "#22d3ee" },
      { key: "accentColor2", label: "Second Accent Color", type: "color", default: "#818cf8" },
    ],
    draw(ctx, v, _p, _z, _ax, _ay, logoImg) {
      const W = this.width, H = this.height;
      const bg1 = v.bgColor1 || "#0c0f1e", bg2 = v.bgColor2 || "#0f2040";
      const ac1 = v.accentColor || "#22d3ee", ac2 = v.accentColor2 || "#818cf8";

      // ── Rich dark gradient background ──
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, bg1); bg.addColorStop(0.45, bg2); bg.addColorStop(1, bg1);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // ── Radial glows ──
      const rg1 = ctx.createRadialGradient(W * 0.15, H * 0.1, 40, W * 0.15, H * 0.1, 500);
      rg1.addColorStop(0, `${ac1}22`); rg1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg1; ctx.fillRect(0, 0, W, H);
      const rg2 = ctx.createRadialGradient(W * 0.85, H * 0.6, 30, W * 0.85, H * 0.6, 420);
      rg2.addColorStop(0, `${ac2}22`); rg2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg2; ctx.fillRect(0, 0, W, H);

      // ── Hex/circuit dot grid ──
      ctx.fillStyle = `${ac1}18`;
      for (let gx = 40; gx < W; gx += 60) for (let gy = 40; gy < H; gy += 60) { ctx.beginPath(); ctx.arc(gx, gy, 1.5, 0, Math.PI * 2); ctx.fill(); }

      // ── Horizontal circuit lines (decorative) ──
      [[200, 0.3],[420, 0.18],[760, 0.22],[980, 0.15],[1100, 0.28],[1280, 0.12]].forEach(([ly2, op]) => {
        ctx.save(); ctx.globalAlpha = op as number;
        const lg = ctx.createLinearGradient(0, ly2 as number, W, ly2 as number);
        lg.addColorStop(0, "rgba(0,0,0,0)"); lg.addColorStop(0.15, ac1); lg.addColorStop(0.85, ac2); lg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.strokeStyle = lg; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(0, ly2 as number); ctx.lineTo(W, ly2 as number); ctx.stroke();
        ctx.restore();
      });

      // ── Logo bar ──
      drawLogoBar(ctx, W, logoImg, 90);

      // ── Hero section: top banner after logo bar ──
      // Accent ribbon behind icon area
      ctx.save();
      const heroG = ctx.createLinearGradient(0, 90, 0, 340);
      heroG.addColorStop(0, `${ac1}1a`); heroG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = heroG; ctx.fillRect(0, 90, W, 250); ctx.restore();

      // Workshop icon + tag badge
      ctx.font = "90px Arial"; ctx.textAlign = "center"; ctx.fillText("🛠️", W / 2, 218);
      // Badge behind WORKSHOP text
      ctx.save();
      const badgeG = ctx.createLinearGradient(W/2 - 200, 228, W/2 + 200, 272);
      badgeG.addColorStop(0, `${ac1}40`); badgeG.addColorStop(0.5, `${ac2}40`); badgeG.addColorStop(1, `${ac1}40`);
      rrect(ctx, W / 2 - 195, 228, 390, 54, 27);
      ctx.fillStyle = badgeG; ctx.fill();
      ctx.strokeStyle = `${ac1}88`; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.restore();
      ctx.font = "bold 28px Arial"; ctx.textAlign = "center";
      const wkG = ctx.createLinearGradient(W/2-150, 0, W/2+150, 0);
      wkG.addColorStop(0, ac1); wkG.addColorStop(1, ac2);
      ctx.fillStyle = wkG; ctx.fillText("⚙ WORKSHOP", W / 2, 266);

      // ── Title text ──
      ctx.save(); ctx.font = "bold 72px Arial"; ctx.textAlign = "center";
      const titleG = ctx.createLinearGradient(0, 300, W, 400);
      titleG.addColorStop(0, "#fff"); titleG.addColorStop(0.6, `#e0f2fe`); titleG.addColorStop(1, ac1);
      ctx.fillStyle = titleG; ctx.shadowColor = ac1; ctx.shadowBlur = 22;
      wrapC(ctx, v.title || "Workshop Title", W / 2, 342, 880, 80); ctx.restore();

      // ── Divider ──
      neonLine(ctx, W, 432, `${ac1}99`);

      // ── "What You'll Learn" section ──
      ctx.save();
      rrect(ctx, 60, 450, W - 120, 220, 16);
      const learnG = ctx.createLinearGradient(60, 450, W - 60, 670);
      learnG.addColorStop(0, `${ac2}15`); learnG.addColorStop(1, `${ac1}10`);
      ctx.fillStyle = learnG; ctx.fill();
      ctx.strokeStyle = `${ac2}44`; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
      ctx.font = "bold 26px Arial"; ctx.textAlign = "left";
      const lhG = ctx.createLinearGradient(100, 0, 500, 0);
      lhG.addColorStop(0, ac1); lhG.addColorStop(1, ac2);
      ctx.fillStyle = lhG; ctx.fillText("📚  What You'll Learn", 96, 494);
      ctx.font = "23px Arial"; ctx.fillStyle = "rgba(255,255,255,0.82)";
      wrapL(ctx, v.topic || "", 96, 534, W - 192, 32);

      // ── Info rows ──
      const rows = [{ i: "📅", l: "Date", val: v.date }, { i: "⏱️", l: "Duration", val: v.duration }, { i: "📍", l: "Venue", val: v.venue }, { i: "💰", l: "Fee", val: v.fee }, { i: "⏳", l: "Deadline", val: v.deadline }];
      let ry = 698;
      rows.forEach(({ i, l, val }, idx) => {
        // Alternating row tint
        ctx.save();
        rrect(ctx, 60, ry, W - 120, 66, 12);
        ctx.fillStyle = idx%2===0 ? `${ac1}12` : `${ac2}0e`; ctx.fill();
        ctx.strokeStyle = idx%2===0 ? `${ac1}30` : `${ac2}28`; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();
        // Label
        ctx.font = "bold 26px Arial"; ctx.textAlign = "left";
        const rowG = ctx.createLinearGradient(90, 0, 340, 0);
        rowG.addColorStop(0, ac1); rowG.addColorStop(1, ac2);
        ctx.fillStyle = rowG; ctx.fillText(`${i}  ${l}`, 90, ry + 42);
        // Value
        ctx.font = "26px Arial"; ctx.fillStyle = "#fff"; ctx.textAlign = "right";
        ctx.fillText(val || "—", W - 90, ry + 42);
        ry += 78;
      });

      // ── CTA Register button ──
      ctx.save();
      const btnX = W / 2 - 280, btnY = H - 180, btnW = 560, btnH = 72;
      rrect(ctx, btnX, btnY, btnW, btnH, 36);
      const btnG = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY);
      btnG.addColorStop(0, ac1); btnG.addColorStop(1, ac2);
      ctx.fillStyle = btnG; ctx.fill(); ctx.restore();
      ctx.save(); ctx.font = "bold 30px Arial"; ctx.fillStyle = "#0c0f1e"; ctx.textAlign = "center";
      ctx.shadowColor = "rgba(255,255,255,0.3)"; ctx.shadowBlur = 8;
      ctx.fillText("🔗  Register Now", W / 2, H - 180); ctx.restore();

      ctx.font = "bold 20px Arial"; ctx.fillStyle = `${ac1}cc`; ctx.textAlign = "center";
      ctx.fillText(v.regLink || "https://diu-rc-new.vercel.app/register", W / 2, H - 130);
      ctx.font = "18px Arial"; ctx.fillStyle = "rgba(255,255,255,0.38)";
      ctx.fillText("Certificate provided upon completion  ✅", W / 2, H - 88);

      // ── Guest Speaker section (if provided) ──
      const guestImg = _p?.["guestImage"];
      if (v.guestName && (guestImg || v.guestPosition)) {
        ctx.save();
        const guestY = H - 160;
        rrect(ctx, 60, guestY - 80, W - 120, 140, 12);
        ctx.fillStyle = `${ac1}18`; ctx.fill();
        ctx.strokeStyle = `${ac2}44`; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();

        // Guest photo if available
        if (guestImg) {
          imgCircle(ctx, guestImg, 140, guestY - 10, 50, 1, 0.5, 0.5);
        }

        // Guest info
        ctx.font = "bold 24px Arial"; ctx.fillStyle = ac1; ctx.textAlign = "left";
        ctx.fillText("🎤 Guest Speaker", 220, guestY - 50);
        ctx.font = "bold 22px Arial"; ctx.fillStyle = "#fff"; ctx.textAlign = "left";
        ctx.fillText(v.guestName, 220, guestY - 20);
        ctx.font = "18px Arial"; ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.textAlign = "left";
        ctx.fillText(v.guestPosition, 220, guestY + 10);
      }
    },
  },

  // 7. Job Post
  {
    id: "job-post", label: "💼 Job Posting", emoji: "💼", category: "Opportunities",
    width: 1080, height: 1400, hasAvatar: false,
    fields: [
      { key: "companyName", label: "Company Name", type: "text", default: "" },
      { key: "jobPosition", label: "Job Position", type: "text", default: "Senior Robotics Engineer" },
      { key: "jobDetails", label: "Job Details", type: "textarea", default: "We're looking for experienced robotics engineers to join our dynamic team. Strong background in ROS, C++, and Python required. 3-5 years of experience preferred." },
      { key: "requirements", label: "Requirements", type: "textarea", default: "• B.S. in Engineering or Computer Science\n• Experience with ROS/ROS2\n• Proficiency in C++ and Python\n• Strong problem-solving skills" },
      { key: "applyLink", label: "Apply Link / Email", type: "text", default: "careers@techinnovations.com" },
      { key: "deadline", label: "Application Deadline", type: "text", default: "March 31, 2026" },
      { key: "accentColor", label: "Accent Color", type: "color", default: "#10b981" },
      { key: "bgColor", label: "Background Color", type: "color", default: "#0f172a" },
    ],
    draw(ctx, v, _ph, _z, _ax, _ay, logoImg) {
      const W = this.width, H = this.height;
      const ac = v.accentColor || "#10b981";
      const bg = v.bgColor || "#0f172a";

      // ── Background ──
      const bgG = ctx.createLinearGradient(0, 0, W, H);
      bgG.addColorStop(0, bg);
      bgG.addColorStop(1, "#1e293b");
      ctx.fillStyle = bgG; ctx.fillRect(0, 0, W, H);

      // ── Accent glow ──
      const rg = ctx.createRadialGradient(W / 2, 200, 50, W / 2, 200, 600);
      rg.addColorStop(0, `${ac}22`); rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);

      // ── Logo bar ──
      drawLogoBar(ctx, W, logoImg, 90);

      // ── "💼 JOB OPPORTUNITY" badge ──
      ctx.save();
      rrect(ctx, W / 2 - 200, 140, 400, 60, 30);
      const badgeG = ctx.createLinearGradient(W / 2 - 200, 140, W / 2 + 200, 200);
      badgeG.addColorStop(0, `${ac}40`); badgeG.addColorStop(1, `${ac}20`);
      ctx.fillStyle = badgeG; ctx.fill();
      ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
      ctx.font = "bold 30px Arial"; ctx.fillStyle = ac; ctx.textAlign = "center";
      ctx.fillText("💼  JOB OPPORTUNITY", W / 2, 180);

      // ── Company name ──
      ctx.font = "bold 36px Arial"; ctx.fillStyle = "#fff"; ctx.textAlign = "center";
      ctx.fillText(v.companyName || "Enter Company Name", W / 2, 250);

      // ── Divider ──
      neonLine(ctx, W, 280, ac);

      // ── Job Position ──
      ctx.save();
      ctx.font = "bold 48px Arial"; ctx.fillStyle = ac; ctx.textAlign = "center";
      ctx.shadowColor = ac; ctx.shadowBlur = 16;
      wrapC(ctx, v.jobPosition || "Job Title", W / 2, 340, 900, 60);
      ctx.restore();

      // ── Job Details Section ──
      ctx.save();
      rrect(ctx, 60, 420, W - 120, 180, 16);
      const detailsG = ctx.createLinearGradient(60, 420, W - 60, 600);
      detailsG.addColorStop(0, `${ac}15`); detailsG.addColorStop(1, `${ac}08`);
      ctx.fillStyle = detailsG; ctx.fill();
      ctx.strokeStyle = `${ac}44`; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();

      ctx.font = "bold 24px Arial"; ctx.fillStyle = ac; ctx.textAlign = "left";
      ctx.fillText("📋 Job Details", 100, 460);
      ctx.font = "20px Arial"; ctx.fillStyle = "rgba(255,255,255,0.82)";
      wrapL(ctx, v.jobDetails || "", 100, 500, W - 160, 28);

      // ── Requirements Section ──
      ctx.save();
      rrect(ctx, 60, 640, W - 120, 200, 16);
      const reqG = ctx.createLinearGradient(60, 640, W - 60, 840);
      reqG.addColorStop(0, `${ac}15`); reqG.addColorStop(1, `${ac}08`);
      ctx.fillStyle = reqG; ctx.fill();
      ctx.strokeStyle = `${ac}44`; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();

      ctx.font = "bold 24px Arial"; ctx.fillStyle = ac; ctx.textAlign = "left";
      ctx.fillText("✅ Requirements", 100, 680);
      ctx.font = "19px Arial"; ctx.fillStyle = "rgba(255,255,255,0.82)";
      wrapL(ctx, v.requirements || "", 100, 720, W - 160, 26);

      // ── Deadline ──
      ctx.font = "bold 20px Arial"; ctx.fillStyle = "#fbbf24"; ctx.textAlign = "center";
      ctx.fillText(`⏰ Deadline: ${v.deadline || "March 31, 2026"}`, W / 2, 910);

      // ── Apply button ──
      ctx.save();
      const btnX = W / 2 - 260, btnY = 960, btnW = 520, btnH = 70;
      rrect(ctx, btnX, btnY, btnW, btnH, 35);
      const btnG = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY);
      btnG.addColorStop(0, ac); btnG.addColorStop(1, "#34d399");
      ctx.fillStyle = btnG; ctx.fill(); ctx.restore();

      ctx.font = "bold 32px Arial"; ctx.fillStyle = "#001f3f"; ctx.textAlign = "center";
      ctx.fillText("📧  Apply Now", W / 2, 1010);

      // ── Application Link ──
      ctx.font = "bold 22px Arial"; ctx.fillStyle = ac; ctx.textAlign = "center";
      ctx.fillText(v.applyLink || "careers@company.com", W / 2, 1090);

      // ── Footer ──
      ctx.font = "18px Arial"; ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.textAlign = "center";
      ctx.fillText("Join our team and make an impact!", W / 2, 1150);
      ctx.font = "bold 16px Arial"; ctx.fillStyle = `${ac}88`; ctx.textAlign = "center";
      ctx.fillText("DIU Robotics Club • Career Opportunity", W / 2, 1200);
    },
  },

  // 8. Birthday Poster (Advanced - Square)
  {
    id: "birthday-poster", label: "🎂 Birthday Poster (Square)", emoji: "🎂", category: "Celebration",
    width: 1080, height: 1080, hasAvatar: true,
    fields: [
      { key: "name", label: "Member Name", type: "text", default: "Nayeem" },
      { key: "role", label: "Role / Position", type: "text", default: "Executive" },
      { key: "message", label: "Birthday Message", type: "textarea", default: "We're happy to celebrate someone who brings energy and dedication to the team. Here's to another great year ahead." },
      { key: "bgColor1", label: "Background Dark (Left)", type: "color", default: "#0f172a" },
      { key: "bgColor2", label: "Background Light (Right)", type: "color", default: "#1e3a8a" },
      { key: "accentColor", label: "Accent/Glow Color", type: "color", default: "#3b82f6" },
      { key: "textColor", label: "Title Text Color", type: "color", default: "#1e3a8a" },
      { key: "paperColor", label: "Paper Color", type: "color", default: "#ffffff" },
      { key: "avatar", label: "Person Photo (Portrait)", type: "image", default: "" },
      { key: "giftColor", label: "Gift Box Color", type: "color", default: "#3b82f6" },
      { key: "ribbonColor", label: "Ribbon Color", type: "color", default: "#fbbf24" },
      { key: "showBgPortrait", label: "Show Background Portrait", type: "select", default: "Yes", options: ["Yes", "No"] },
    ],
    draw(ctx, v, photos, zoom, ax, ay, logoImg) {
      const W = this.width, H = this.height;
      const avatarImg = photos["avatar"];
      const bgL = v.bgColor1 || "#0f172a";
      const bgR = v.bgColor2 || "#1e3a8a";
      const ac = v.accentColor || "#3b82f6";
      const tc = v.textColor || "#1e3a8a";
      const pc = v.paperColor || "#ffffff";
      const gc = v.giftColor || "#3b82f6";
      const rc = v.ribbonColor || "#fbbf24";

      // ── Background gradient (dark left → blue right) ──
      const bgG = ctx.createLinearGradient(0, 0, W, 0);
      bgG.addColorStop(0, bgL);
      bgG.addColorStop(1, bgR);
      ctx.fillStyle = bgG;
      ctx.fillRect(0, 0, W, H);

      // ── Soft blue glow (right side) ──
      const glowG = ctx.createRadialGradient(W * 0.8, H * 0.2, 100, W * 0.8, H * 0.2, 800);
      glowG.addColorStop(0, `${ac}33`);
      glowG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glowG;
      ctx.fillRect(0, 0, W, H);

      // ── Background portrait (if enabled) ──
      if (v.showBgPortrait === "Yes" && avatarImg) {
        ctx.save();
        ctx.globalAlpha = 0.25;
        imgCover(ctx, avatarImg, W * 0.35, 0, W * 0.65, H, zoom, ax, ay);
        // Blue overlay on background portrait
        ctx.fillStyle = `${bgR}88`;
        ctx.fillRect(W * 0.35, 0, W * 0.65, H);
        ctx.restore();
      }

      // ── Large faded BIRTHDAY watermark ──
      ctx.save();
      ctx.font = "bold 200px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.textAlign = "center";
      ctx.fillText("BIRTHDAY", W / 2, H / 2 + 40);
      ctx.restore();

      // ── Top professional header with DIU Robotics branding ──
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.fillRect(0, 0, W, 130);
      
      // Logo (larger)
      const logoW = 85, logoH = 85;
      if (logoImg) {
        ctx.drawImage(logoImg, 16 + _logoOpts.ox, 22 + _logoOpts.oy, logoW * _logoOpts.size, logoH * _logoOpts.size);
      }
      
      // Daffodil International University text
      ctx.font = "bold 20px Arial";
      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "left";
      ctx.fillText("Daffodil International University", 115, 38);
      
      // ROBOTICS CLUB text (larger, prominent)
      ctx.font = "bold 32px Arial";
      ctx.fillStyle = tc;
      ctx.fillText("ROBOTICS CLUB", 115, 85);
      
      // Divider line
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 130);
      ctx.lineTo(W, 130);
      ctx.stroke();

      // ── Torn paper strip (center-left area, after header) ──
      const paperY = 200;
      const paperH = 200;
      const paperX = 30;
      const paperW = W * 0.42;
      
      // Draw torn paper shape
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(paperX, paperY);
      ctx.lineTo(paperX + paperW, paperY);
      // Torn edge right side
      for (let i = 0; i < 12; i++) {
        const jitX = (Math.random() - 0.5) * 8;
        const segH = paperH / 12;
        ctx.lineTo(paperX + paperW + 6 + jitX, paperY + (i + 1) * segH);
      }
      ctx.lineTo(paperX, paperY + paperH);
      ctx.closePath();
      ctx.fillStyle = pc;
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetX = 4;
      ctx.fill();
      ctx.restore();

      // ── "HAPPY" text (bold, dark blue, on paper) ──
      ctx.save();
      ctx.font = "bold 110px Arial";
      ctx.fillStyle = tc;
      ctx.textAlign = "left";
      ctx.fillText("HAPPY", paperX + 20, paperY + 110);
      ctx.restore();

      // ── "Birthday" text (elegant serif, dark blue) ──
      ctx.save();
      ctx.font = "italic 100px Georgia";
      ctx.fillStyle = tc;
      ctx.textAlign = "left";
      ctx.fillText("Birthday", paperX + 20, paperY + 190);
      ctx.restore();

      // ── Main person photo (right side, extends to bottom) ──
      const photoX = W * 0.45;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 48;
      ctx.shadowOffsetX = -12;
      if (avatarImg) {
        imgCover(ctx, avatarImg, photoX, 150, W - photoX - 20, H - 150, zoom, ax, ay);
      }
      ctx.restore();

      // ── Name section (bottom-left) ──
      // Name - larger, bold white
      ctx.font = "bold 56px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText(v.name || "Nayeem", 32, H - 160);

      // "Executive" - smaller subtitle
      ctx.font = "bold 20px Arial";
      ctx.fillStyle = ac;
      ctx.textAlign = "left";
      ctx.fillText(v.role || "Executive", 32, H - 125);

      // ── Message text ──
      ctx.font = "16px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.textAlign = "left";
      wrapL(ctx, v.message || "", 32, H - 95, W * 0.43 - 20, 22);

      // ── 3D Gift box (bottom right corner) ──
      drawGiftBox(ctx, W - 120, H - 140, 80, gc, rc);
    },
  },
];

// ── Gift box drawing helper ──
function drawGiftBox(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, boxColor: string, ribbonColor: string) {
  // Front face
  ctx.save();
  ctx.fillStyle = boxColor;
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
  // Darker right edge (3D effect)
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(x + size / 2 - 12, y - size / 2, 12, size);
  // Darker bottom edge
  ctx.fillRect(x - size / 2, y + size / 2 - 12, size, 12);
  
  // Top face (lighter)
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  const skew = 8;
  ctx.beginPath();
  ctx.moveTo(x - size / 2, y - size / 2);
  ctx.lineTo(x + size / 2 - skew, y - size / 2 - skew);
  ctx.lineTo(x + size / 2 - skew, y - size / 2 - skew + size * 0.15);
  ctx.lineTo(x - size / 2, y - size / 2 + size * 0.15);
  ctx.closePath();
  ctx.fill();
  
  // Glossy shine
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(x - size / 2 + 4, y - size / 2 + 4, size * 0.3, size * 0.3);
  
  // Ribbon - horizontal
  ctx.strokeStyle = ribbonColor;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x - size / 2, y);
  ctx.lineTo(x + size / 2, y);
  ctx.stroke();
  
  // Ribbon - vertical
  ctx.beginPath();
  ctx.moveTo(x, y - size / 2);
  ctx.lineTo(x, y + size / 2);
  ctx.stroke();
  
  // Ribbon bow (top center)
  ctx.fillStyle = ribbonColor;
  // Left loop
  ctx.beginPath();
  ctx.arc(x - 10, y - size / 2 - 8, 10, 0, Math.PI * 2);
  ctx.fill();
  // Right loop
  ctx.beginPath();
  ctx.arc(x + 10, y - size / 2 - 8, 10, 0, Math.PI * 2);
  ctx.fill();
  // Center knot
  ctx.beginPath();
  ctx.arc(x, y - size / 2 - 4, 7, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

// ── Component ─────────────────────────────────────────────────────────────────
function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => { const img = new window.Image(); img.crossOrigin = "anonymous"; img.onload = () => res(img); img.onerror = rej; img.src = src; });
}

export default function PhotoTemplatesPage() {
  const [selected, setSelected] = useState<Template>(TEMPLATES[0]);
  const [values, setValues] = useState<Record<string, string>>(() => { const v: Record<string, string> = {}; TEMPLATES[0].fields.forEach((f) => (v[f.key] = f.default)); return v; });
  const [photoSrcs, setPhotoSrcs] = useState<Record<string, string>>({});
  const [photoZoom, setPhotoZoom] = useState(1.0);
  const [photoAlignX, setPhotoAlignX] = useState(0.5);
  const [photoAlignY, setPhotoAlignY] = useState(0.5);
  const [logoUrl, setLogoUrl] = useState("/diurc_logo.png");
  const [logoSize, setLogoSize] = useState(1.0);
  const [logoOffsetX, setLogoOffsetX] = useState(0);
  const [logoOffsetY, setLogoOffsetY] = useState(0);
  const [rendering, setRendering] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>("Celebration");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cats = Array.from(new Set(TEMPLATES.map((t) => t.category)));

  const selectTemplate = (t: Template) => {
    setSelected(t); const v: Record<string, string> = {}; t.fields.forEach((f) => (v[f.key] = f.default));
    setValues(v); setPhotoSrcs({}); setPhotoZoom(1.0); setPhotoAlignX(0.5); setPhotoAlignY(0.5);
  };

  const render = useCallback(async () => {
    const canvas = canvasRef.current; if (!canvas) return;
    setRendering(true); canvas.width = selected.width; canvas.height = selected.height;
    const ctx = canvas.getContext("2d")!; ctx.clearRect(0, 0, selected.width, selected.height);
    const photos: Record<string, HTMLImageElement | null> = {};
    for (const [key, src] of Object.entries(photoSrcs)) { if (src) { try { photos[key] = await loadImg(src); } catch { photos[key] = null; } } else photos[key] = null; }
    let logoImg: HTMLImageElement | null = null; try { logoImg = await loadImg(logoUrl || "/diurc_logo.png"); } catch {}
    _logoOpts = { size: logoSize, ox: logoOffsetX, oy: logoOffsetY };
    selected.draw(ctx, values, photos, photoZoom, photoAlignX, photoAlignY, logoImg);
    setRendering(false);
  }, [selected, values, photoSrcs, photoZoom, photoAlignX, photoAlignY, logoUrl, logoSize, logoOffsetX, logoOffsetY]);

  useEffect(() => { render(); }, [render]);

  const download = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const a = document.createElement("a"); a.download = `diurc-${selected.id}-${Date.now()}.png`; a.href = canvas.toDataURL("image/png"); a.click();
  };

  const handlePhoto = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = (ev) => setPhotoSrcs((p) => ({ ...p, [key]: ev.target?.result as string })); reader.readAsDataURL(file);
  };

  const imageFields = selected.fields.filter((f) => f.type === "image");

  return (
    <div className="text-white max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-1"><Palette size={28} className="text-purple-400" />Photo Templates</h1>
        <p className="text-white/50 text-sm">Canva-style graphics — fill fields, adjust photo, click Download PNG.</p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Left */}
        <div className="space-y-4">
          {/* Template picker */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <p className="px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-widest border-b border-white/10">Choose Template</p>
            {cats.map((cat) => {
              const items = TEMPLATES.filter((t) => t.category === cat), isOpen = openCat === cat;
              return (
                <div key={cat} className="border-b border-white/10 last:border-0">
                  <button onClick={() => setOpenCat(isOpen ? null : cat)} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 text-sm font-semibold text-white/70 transition-colors">
                    {cat}{isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {isOpen && (
                    <div className="px-2 pb-2 space-y-1">
                      {items.map((t) => (
                        <button key={t.id} onClick={() => selectTemplate(t)} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${selected.id === t.id ? "bg-purple-500/25 text-purple-200 border border-purple-400/40" : "hover:bg-white/5 text-white/70 border border-transparent"}`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Fields */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">Content</p>
            {selected.fields.map((field) => {
              if (field.type === "image") {
                const src = photoSrcs[field.key];
                return (
                  <div key={field.key}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-white/50">{field.label}</label>
                      <a href="https://www.removebg.free/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-400 hover:text-emerald-300 underline">✂ Remove BG</a>
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => handlePhoto(field.key, e)} className="block w-full text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-purple-500/20 file:text-purple-300 file:text-xs file:font-medium hover:file:bg-purple-500/30 cursor-pointer" />
                    {src && (
                      <div className="mt-2 flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                        <button onClick={() => setPhotoSrcs((p) => { const n = { ...p }; delete n[field.key]; return n; })} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                      </div>
                    )}
                  </div>
                );
              }
              if (field.type === "color") return (
                <div key={field.key} className="flex items-center justify-between">
                  <label className="text-xs text-white/50">{field.label}</label>
                  <input type="color" value={values[field.key] ?? field.default} onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))} className="w-10 h-8 rounded-lg border border-white/15 cursor-pointer bg-transparent" />
                </div>
              );
              if (field.type === "textarea") return (
                <div key={field.key}>
                  <label className="block text-xs text-white/50 mb-1">{field.label}</label>
                  <textarea rows={3} value={values[field.key] ?? field.default} onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y" />
                </div>
              );
              if (field.type === "select") return (
                <div key={field.key}>
                  <label className="block text-xs text-white/50 mb-1">{field.label}</label>
                  <select value={values[field.key] ?? field.default} onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
                    {field.options?.map((opt) => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                  </select>
                </div>
              );
              return (
                <div key={field.key}>
                  <label className="block text-xs text-white/50 mb-1">{field.label}</label>
                  <input type="text" value={values[field.key] ?? field.default} onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              );
            })}
          </div>

          {/* Photo Resize Controls */}
          {imageFields.length > 0 && (
            <div className="bg-purple-500/10 border border-purple-400/25 rounded-2xl p-4 space-y-4">
              <p className="text-xs font-semibold text-purple-300 flex items-center gap-1.5 uppercase tracking-widest"><ZoomIn size={13} />Photo Adjustments</p>
              {/* Zoom */}
              <div>
                <div className="flex justify-between text-xs text-white/50 mb-1"><span>Zoom</span><span className="text-purple-300 font-mono">{Math.round(photoZoom * 100)}%</span></div>
                <input type="range" min="0.5" max="3.0" step="0.05" value={photoZoom} onChange={(e) => setPhotoZoom(Number(e.target.value))} className="w-full accent-purple-400" />
                <div className="flex justify-between text-[10px] text-white/25 mt-0.5"><span>50%</span><span>300%</span></div>
              </div>
              {/* Horizontal */}
              <div>
                <div className="flex justify-between text-xs text-white/50 mb-1"><span>Horizontal Position</span><span className="text-purple-300 font-mono">{Math.round(photoAlignX * 100)}%</span></div>
                <input type="range" min="0" max="1" step="0.01" value={photoAlignX} onChange={(e) => setPhotoAlignX(Number(e.target.value))} className="w-full accent-purple-400" />
                <div className="flex justify-between text-[10px] text-white/25 mt-0.5"><span>Left</span><span>Right</span></div>
              </div>
              {/* Vertical */}
              <div>
                <div className="flex justify-between text-xs text-white/50 mb-1"><span>Vertical Position</span><span className="text-purple-300 font-mono">{Math.round(photoAlignY * 100)}%</span></div>
                <input type="range" min="0" max="1" step="0.01" value={photoAlignY} onChange={(e) => setPhotoAlignY(Number(e.target.value))} className="w-full accent-purple-400" />
                <div className="flex justify-between text-[10px] text-white/25 mt-0.5"><span>Top</span><span>Bottom</span></div>
              </div>
              {/* Presets */}
              <div>
                <p className="text-xs text-white/40 mb-2">Quick presets</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "Face Top", ay: 0.1, ax: 0.5 }, { label: "Center", ay: 0.5, ax: 0.5 }, { label: "Face Bot", ay: 0.8, ax: 0.5 },
                    { label: "Left", ay: 0.5, ax: 0.2 }, { label: "Middle", ay: 0.5, ax: 0.5 }, { label: "Right", ay: 0.5, ax: 0.8 },
                  ].map(({ label, ay, ax }) => (
                    <button key={label} onClick={() => { setPhotoAlignY(ay); setPhotoAlignX(ax); }} className="py-1.5 text-[11px] font-medium bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-400/40 text-white/50 hover:text-purple-200 rounded-lg transition-colors">{label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Logo Settings */}
          <div className="bg-blue-500/10 border border-blue-400/25 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest">🖼️ Logo Settings</p>
            <div>
              <label className="block text-xs text-white/50 mb-1">Logo Image URL</label>
              <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="/diurc_logo.png" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-[10px] text-white/30 mt-1">URL or /public path — e.g. https://… or /diurc_logo.png</p>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/50 mb-1"><span>Logo Size</span><span className="text-blue-300 font-mono">{Math.round(logoSize * 100)}%</span></div>
              <input type="range" min="0.3" max="2.0" step="0.05" value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} className="w-full accent-blue-400" />
              <div className="flex justify-between text-[10px] text-white/25 mt-0.5"><span>30%</span><span>200%</span></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/50 mb-1"><span>Logo X Position</span><span className="text-blue-300 font-mono">{logoOffsetX > 0 ? "+" : ""}{logoOffsetX}px</span></div>
              <input type="range" min="-80" max="80" step="1" value={logoOffsetX} onChange={(e) => setLogoOffsetX(Number(e.target.value))} className="w-full accent-blue-400" />
              <div className="flex justify-between text-[10px] text-white/25 mt-0.5"><span>◀ Left</span><span>Right ▶</span></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/50 mb-1"><span>Logo Y Position</span><span className="text-blue-300 font-mono">{logoOffsetY > 0 ? "+" : ""}{logoOffsetY}px</span></div>
              <input type="range" min="-30" max="30" step="1" value={logoOffsetY} onChange={(e) => setLogoOffsetY(Number(e.target.value))} className="w-full accent-blue-400" />
              <div className="flex justify-between text-[10px] text-white/25 mt-0.5"><span>▲ Up</span><span>Down ▼</span></div>
            </div>
            <button onClick={() => { setLogoUrl("/diurc_logo.png"); setLogoSize(1.0); setLogoOffsetX(0); setLogoOffsetY(0); }} className="w-full py-1.5 text-xs text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/8 border border-white/10 rounded-lg transition-colors">Reset to Default</button>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white/70">Preview — {selected.width} × {selected.height} px</p>
              <div className="flex gap-2">
                <button onClick={render} disabled={rendering} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/15 text-white/60 hover:text-white rounded-lg transition-colors disabled:opacity-40">
                  <RefreshCw size={13} className={rendering ? "animate-spin" : ""} />Refresh
                </button>
                <button onClick={download} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg">
                  <Download size={13} />Download PNG
                </button>
              </div>
            </div>
            <div className="w-full overflow-auto rounded-xl bg-[#0a1120] border border-white/5 flex items-center justify-center p-2">
              <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", borderRadius: "10px", display: "block" }} />
            </div>
            <p className="mt-2 text-xs text-white/25 text-center">Downloaded PNG is full {selected.width}×{selected.height}px resolution</p>
          </div>

          {/* Quick grid */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">All Templates</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => selectTemplate(t)} className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border text-center transition-all text-xs font-medium ${selected.id === t.id ? "bg-purple-500/20 border-purple-400/50 text-purple-200" : "bg-white/3 border-white/10 hover:bg-white/8 hover:border-white/20 text-white/60 hover:text-white"}`}>
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="leading-tight">{t.label.replace(/^.+? /, "")}</span>
                  <span className="text-[10px] text-white/30">{t.width}×{t.height}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
