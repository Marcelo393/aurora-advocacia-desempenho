#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera 4 quadrinhos premium (1080x1350, 4:5) para carrossel de Instagram.
Aula: RESPONSABILIDADE CIVIL - a diarista pode ser obrigada a indenizar
por quebrar algo, sem querer, na casa onde trabalha?
Estilo: ilustracao vetorial moderna, escritorio de advocacia.
Rabicho dos baloes ancorado na boca de quem fala. Sem assinatura.
"""
import os
import math
import random
import cairosvg

W, H = 1080, 1350
OUT = os.path.join(os.path.dirname(__file__), "..", "quadrinhos")
os.makedirs(OUT, exist_ok=True)

# ---- Paleta ----
NAVY = "#16263f"; NAVY_D = "#0e1b2e"; NAVY_L = "#28456b"
GOLD = "#cba24c"; GOLD_L = "#e3c170"; GOLD_D = "#a07f30"
CREAM = "#f7f1e6"; WALL_T = "#e9ddc7"; WALL_B = "#d8c8aa"
SKIN = "#f1c9a5"; SKIN_SH = "#e0ad84"; SKIN_L = "#f8d8b9"
HAIR = "#3b2a1c"; HAIR_L = "#5a4127"
WOOD = "#7c5230"; WOOD_D = "#5d3c22"; WOOD_L = "#9a6a3f"
DRESS_D = "#1f6573"; INK = "#20242b"


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def wrap(text, max_chars):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + (1 if cur else 0) <= max_chars:
            cur = (cur + " " + w).strip()
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


# ============================ DEFS ============================
def defs():
    return f'''
<defs>
  <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{WALL_T}"/><stop offset="1" stop-color="{WALL_B}"/>
  </linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#c9b694"/><stop offset="1" stop-color="#b8a17c"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.34" r="0.75">
    <stop offset="0" stop-color="#fff7e6" stop-opacity="0.9"/>
    <stop offset="1" stop-color="#fff7e6" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{WOOD_L}"/><stop offset="0.5" stop-color="{WOOD}"/><stop offset="1" stop-color="{WOOD_D}"/>
  </linearGradient>
  <linearGradient id="suit" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="{NAVY_L}"/><stop offset="0.55" stop-color="{NAVY}"/><stop offset="1" stop-color="{NAVY_D}"/>
  </linearGradient>
  <linearGradient id="dress" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#3a93a3"/><stop offset="1" stop-color="{DRESS_D}"/>
  </linearGradient>
  <radialGradient id="skinF" cx="0.42" cy="0.4" r="0.7">
    <stop offset="0" stop-color="{SKIN_L}"/><stop offset="1" stop-color="{SKIN}"/>
  </radialGradient>
  <radialGradient id="skinFm" cx="0.42" cy="0.4" r="0.7">
    <stop offset="0" stop-color="{SKIN_L}"/><stop offset="1" stop-color="{SKIN_SH}"/>
  </radialGradient>
  <linearGradient id="bub" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f2f4f7"/>
  </linearGradient>
  <linearGradient id="ribbon" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{NAVY}"/><stop offset="1" stop-color="{NAVY_D}"/>
  </linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{GOLD_L}"/><stop offset="1" stop-color="{GOLD_D}"/>
  </linearGradient>
</defs>'''


def soft_shadow(cx, cy, rx, ry, op=0.18):
    s = ""
    for i in range(5):
        f = 1 + i * 0.16
        s += f'<ellipse cx="{cx}" cy="{cy}" rx="{rx*f:.0f}" ry="{ry*f:.0f}" fill="#000000" opacity="{op/(i+1.3):.3f}"/>'
    return s


# ============================ CENARIO ============================
def office_background():
    s = []
    s.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="url(#wall)"/>')
    s.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="url(#glow)"/>')
    floor_y = 1040
    s.append(f'<rect x="0" y="{floor_y}" width="{W}" height="{H-floor_y}" fill="url(#floor)"/>')
    s.append(f'<rect x="0" y="{floor_y}" width="{W}" height="10" fill="#a98f68"/>')

    # janela (esquerda)
    wx, wy, ww, wh = 70, 250, 250, 330
    s.append(f'<rect x="{wx-16}" y="{wy-16}" width="{ww+32}" height="{wh+32}" rx="10" fill="{CREAM}"/>')
    s.append(f'<rect x="{wx-16}" y="{wy-16}" width="{ww+32}" height="{wh+32}" rx="10" fill="none" stroke="#cdbb98" stroke-width="4"/>')
    s.append(f'<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3f2"/><stop offset="1" stop-color="#eaf6ee"/></linearGradient>')
    s.append(f'<rect x="{wx}" y="{wy}" width="{ww}" height="{wh}" fill="url(#sky)"/>')
    s.append(f'<rect x="{wx+18}" y="{wy+150}" width="46" height="{wh-150}" fill="#cdd9d2"/>')
    s.append(f'<rect x="{wx+78}" y="{wy+100}" width="54" height="{wh-100}" fill="#bcccc4"/>')
    s.append(f'<rect x="{wx+150}" y="{wy+170}" width="60" height="{wh-170}" fill="#cdd9d2"/>')
    s.append(f'<circle cx="{wx+ww-46}" cy="{wy+58}" r="30" fill="#fbe6a8"/>')
    s.append(f'<line x1="{wx+ww/2}" y1="{wy}" x2="{wx+ww/2}" y2="{wy+wh}" stroke="{CREAM}" stroke-width="10"/>')
    s.append(f'<line x1="{wx}" y1="{wy+wh/2}" x2="{wx+ww}" y2="{wy+wh/2}" stroke="{CREAM}" stroke-width="10"/>')
    s.append(f'<rect x="{wx+40}" y="{wy+wh-6}" width="80" height="44" rx="8" fill="{GOLD_D}"/>')
    s.append(f'<rect x="{wx+40}" y="{wy+wh-6}" width="80" height="14" rx="6" fill="{GOLD}"/>')
    for dx, dy in [(-2,-70),(18,-86),(40,-66),(-18,-58),(58,-50)]:
        s.append(f'<path d="M {wx+80} {wy+wh} q {dx} {dy} {dx*1.1:.0f} {dy*0.4:.0f}" stroke="#3f8a52" stroke-width="9" fill="none" stroke-linecap="round"/>')

    # estante (direita)
    bx, by, bw, bh = 720, 210, 300, 470
    s.append(f'<rect x="{bx-12}" y="{by-12}" width="{bw+24}" height="{bh+24}" rx="8" fill="{WOOD_D}"/>')
    s.append(f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" fill="#caa97e"/>')
    shelf_colors = ["#8d3b3b","#b07a2e","#2f5d6e","#3d6b45","#7a4a86","#9a8430","#46566e"]
    rows = 4; rh = bh / rows
    for r in range(rows):
        ry = by + r * rh + 8
        s.append(f'<rect x="{bx}" y="{ry-8}" width="{bw}" height="{rh-12}" fill="#dcc097"/>')
        x = bx + 12; ci = r
        while x < bx + bw - 22:
            random.seed(r*97 + x)
            bwid = random.choice([20, 24, 26, 30])
            bhgt = rh - 26 - random.choice([0, 6, 10])
            col = shelf_colors[ci % len(shelf_colors)]
            top = ry + (rh - 18) - bhgt
            s.append(f'<rect x="{x}" y="{top}" width="{bwid}" height="{bhgt}" fill="{col}"/>')
            s.append(f'<rect x="{x}" y="{top+6}" width="{bwid}" height="3" fill="#ffffff" opacity="0.35"/>')
            x += bwid + 4; ci += 1
        s.append(f'<rect x="{bx}" y="{ry + rh - 20}" width="{bw}" height="8" fill="{WOOD}"/>')

    # diploma (centro-alto)
    dx, dy = 430, 210
    s.append(soft_shadow(dx+105, dy+150, 96, 14, 0.10))
    s.append(f'<rect x="{dx}" y="{dy}" width="210" height="150" rx="6" fill="{GOLD_D}"/>')
    s.append(f'<rect x="{dx+8}" y="{dy+8}" width="194" height="134" rx="3" fill="#fbf6ea"/>')
    s.append(f'<text x="{dx+105}" y="{dy+44}" font-family="Playfair Display" font-size="20" font-weight="700" fill="{NAVY}" text-anchor="middle">CERTIFICADO</text>')
    for ly in (60, 76, 92):
        s.append(f'<line x1="{dx+40}" y1="{dy+ly}" x2="{dx+170}" y2="{dy+ly}" stroke="#c9bda3" stroke-width="2"/>')
    s.append(f'<circle cx="{dx+105}" cy="{dy+118}" r="16" fill="{GOLD}"/>')
    s.append(f'<text x="{dx+105}" y="{dy+124}" font-family="Poppins" font-size="13" font-weight="700" fill="{NAVY}" text-anchor="middle">OAB</text>')
    return "".join(s)


def desk_front(extra=""):
    top = 1010
    s = []
    s.append(soft_shadow(W/2, top+6, 520, 26, 0.16))
    s.append(f'<rect x="-20" y="{top}" width="{W+40}" height="{H-top}" fill="url(#desk)"/>')
    s.append(f'<rect x="-20" y="{top}" width="{W+40}" height="14" fill="{WOOD_L}"/>')
    s.append(f'<rect x="-20" y="{top+14}" width="{W+40}" height="6" fill="#ffffff" opacity="0.18"/>')
    for gx in range(40, W, 120):
        s.append(f'<path d="M {gx} {top+30} q 30 40 0 90" stroke="{WOOD_D}" stroke-width="2" fill="none" opacity="0.25"/>')
    s.append(extra)
    return "".join(s)


def desk_items():
    top = 1010
    s = []
    s.append(f'<g transform="translate(150 {top+34}) rotate(-6)">'
             f'<rect x="-70" y="-6" width="150" height="92" rx="6" fill="#f7f4ec" stroke="#d8cfba" stroke-width="2"/>'
             f'<line x1="-50" y1="18" x2="58" y2="18" stroke="#c2b7a0" stroke-width="3"/>'
             f'<line x1="-50" y1="36" x2="58" y2="36" stroke="#c2b7a0" stroke-width="3"/>'
             f'<line x1="-50" y1="54" x2="30" y2="54" stroke="#c2b7a0" stroke-width="3"/></g>')
    s.append(f'<g transform="translate(150 {top+96}) rotate(24)">'
             f'<rect x="0" y="0" width="120" height="10" rx="5" fill="url(#gold)"/>'
             f'<polygon points="120,0 138,5 120,10" fill="{NAVY}"/></g>')
    sx, sy = 882, top + 96
    s.append(soft_shadow(sx, sy+6, 70, 12, 0.14))
    s.append(f'<rect x="{sx-34}" y="{sy-6}" width="68" height="14" rx="6" fill="url(#gold)"/>')
    s.append(f'<rect x="{sx-7}" y="{sy-96}" width="14" height="94" fill="url(#gold)"/>')
    s.append(f'<rect x="{sx-66}" y="{sy-100}" width="132" height="10" rx="5" fill="url(#gold)"/>')
    s.append(f'<circle cx="{sx}" cy="{sy-104}" r="11" fill="{GOLD_L}"/>')
    for bx in (sx-60, sx+60):
        s.append(f'<line x1="{sx}" y1="{sy-95}" x2="{bx}" y2="{sy-95}" stroke="url(#gold)" stroke-width="4"/>')
        s.append(f'<line x1="{bx}" y1="{sy-95}" x2="{bx-16}" y2="{sy-58}" stroke="{GOLD_D}" stroke-width="3"/>')
        s.append(f'<line x1="{bx}" y1="{sy-95}" x2="{bx+16}" y2="{sy-58}" stroke="{GOLD_D}" stroke-width="3"/>')
        s.append(f'<path d="M {bx-22} {sy-58} a 22 12 0 0 0 44 0 Z" fill="{GOLD_L}" stroke="{GOLD_D}" stroke-width="2"/>')
    return "".join(s)


# ============================ PERSONAGENS ============================
def hand(x, y, r=20, female=False):
    fill = "url(#skinF)" if female else "url(#skinFm)"
    return f'<ellipse cx="{x}" cy="{y}" rx="{r}" ry="{r*0.82:.0f}" fill="{fill}" stroke="{SKIN_SH}" stroke-width="2"/>'


def head_top_of(cx, base, scale, off):
    """Ponto-alvo (topo da cabeca) do personagem para o rabicho do balao.
    Mirar no topo da cabeca evita que o rabicho invada o rosto."""
    return (cx, base - off * scale)


def woman(cx, base, scale=1.0, look=4):
    g = [f'<g transform="translate({cx} {base}) scale({scale})">']
    g.append(soft_shadow(0, 250, 150, 26, 0.16))
    g.append(f'<path d="M -150 260 Q -160 70 -90 30 L 90 30 Q 160 70 150 260 Z" fill="url(#dress)"/>')
    g.append(f'<path d="M -54 36 L 0 96 L 54 36 Q 0 18 -54 36 Z" fill="#f4efe4"/>')
    g.append(f'<path d="M -54 36 L -16 30 L -26 70 Z" fill="#e7dfcd"/>')
    g.append(f'<path d="M 54 36 L 16 30 L 26 70 Z" fill="#e7dfcd"/>')
    g.append(f'<path d="M -78 260 L -70 110 Q 0 92 70 110 L 78 260 Z" fill="{CREAM}"/>')
    g.append(f'<path d="M -70 110 L -40 60 M 70 110 L 40 60" stroke="{CREAM}" stroke-width="16" fill="none" stroke-linecap="round"/>')
    g.append(f'<path d="M -78 260 L -70 110 Q -36 96 0 95 L 0 260 Z" fill="#000000" opacity="0.04"/>')
    g.append(f'<rect x="-44" y="170" width="88" height="60" rx="10" fill="none" stroke="#ddd2bb" stroke-width="4"/>')
    g.append(f'<path d="M 60 30 Q 160 70 150 260 L 96 260 Q 110 110 60 40 Z" fill="#000000" opacity="0.10"/>')
    g.append(f'<path d="M -128 110 Q -176 200 -120 250" stroke="url(#dress)" stroke-width="46" fill="none" stroke-linecap="round"/>')
    g.append(f'<path d="M 128 110 Q 176 200 120 250" stroke="url(#dress)" stroke-width="46" fill="none" stroke-linecap="round"/>')
    g.append(hand(-126, 252, 22, True))
    g.append(hand(126, 252, 22, True))
    g.append(f'<path d="M -22 -20 q 22 30 44 0 l 0 56 q -22 22 -44 0 Z" fill="url(#skinF)"/>')
    g.append(f'<path d="M -22 30 q 22 18 44 0 l 0 6 q -22 16 -44 0 Z" fill="{SKIN_SH}" opacity="0.5"/>')
    g.append(f'<circle cx="-82" cy="-2" r="6" fill="{GOLD}"/>')
    g.append(f'<circle cx="82" cy="-2" r="6" fill="{GOLD}"/>')
    g.append(f'<circle cx="0" cy="-58" r="84" fill="url(#skinF)"/>')
    g.append(f'<circle cx="-82" cy="-52" r="14" fill="url(#skinF)"/>')
    g.append(f'<circle cx="82" cy="-52" r="14" fill="url(#skinF)"/>')
    # cabelo (coque limpo, sem fios sobre o rosto)
    g.append(f'<path d="M -84 -50 Q -96 -158 0 -156 Q 96 -158 84 -50 Q 70 -96 44 -104 '
             f'Q 0 -118 -44 -104 Q -70 -96 -84 -50 Z" fill="{HAIR}"/>')
    g.append(f'<path d="M -84 -50 Q -90 -120 -40 -150 Q -70 -110 -60 -60 Z" fill="{HAIR_L}" opacity="0.6"/>')
    g.append(f'<circle cx="0" cy="-150" r="30" fill="{HAIR}"/>')
    g.append(f'<circle cx="-8" cy="-156" r="11" fill="{HAIR_L}" opacity="0.7"/>')
    g.append(f'<path d="M -46 -68 q 16 -10 30 -2" stroke="{HAIR}" stroke-width="6" fill="none" stroke-linecap="round"/>')
    g.append(f'<path d="M 16 -70 q 14 -8 30 2" stroke="{HAIR}" stroke-width="6" fill="none" stroke-linecap="round"/>')
    for ex in (-30, 30):
        g.append(f'<ellipse cx="{ex}" cy="-50" rx="11" ry="13" fill="#ffffff"/>')
        g.append(f'<circle cx="{ex+look}" cy="-48" r="7" fill="#3a2a1d"/>')
        g.append(f'<circle cx="{ex+look+2}" cy="-50" r="2.4" fill="#fff"/>')
        g.append(f'<path d="M {ex-12} -60 q 12 -8 24 -2" stroke="{INK}" stroke-width="3" fill="none" stroke-linecap="round"/>')
    g.append(f'<path d="M 0 -44 q 8 12 -2 18" stroke="{SKIN_SH}" stroke-width="4" fill="none" stroke-linecap="round"/>')
    g.append(f'<ellipse cx="-44" cy="-22" rx="14" ry="9" fill="#f0a487" opacity="0.45"/>')
    g.append(f'<ellipse cx="44" cy="-22" rx="14" ry="9" fill="#f0a487" opacity="0.45"/>')
    g.append(f'<path d="M -24 -16 q 24 24 48 0 q -24 11 -48 0 Z" fill="#b65b52"/>')
    g.append(f'<path d="M -24 -16 q 24 7 48 0" stroke="#fff" stroke-width="4" fill="none"/>')
    g.append('</g>')
    return "".join(g)


def lawyer(cx, base, scale=1.0, gesture="rest", look=-4):
    g = [f'<g transform="translate({cx} {base}) scale({scale})">']
    g.append(soft_shadow(0, 250, 165, 28, 0.16))
    g.append(f'<path d="M -160 260 Q -172 64 -96 26 L 96 26 Q 172 64 160 260 Z" fill="url(#suit)"/>')
    g.append(f'<path d="M -54 30 L 0 300 L 54 30 Q 0 14 -54 30 Z" fill="#f4f6f9"/>')
    g.append(f'<path d="M 0 38 L -18 70 L 0 250 L 18 70 Z" fill="url(#gold)"/>')
    g.append(f'<path d="M -14 38 L 0 60 L 14 38 Z" fill="{GOLD_D}"/>')
    g.append(f'<path d="M -54 30 L -6 22 L -22 210 Z" fill="{NAVY_D}"/>')
    g.append(f'<path d="M 54 30 L 6 22 L 22 210 Z" fill="{NAVY}"/>')
    g.append(f'<path d="M -54 30 L -10 24 L -16 120 Z" fill="#ffffff" opacity="0.05"/>')
    g.append(f'<path d="M 80 150 l 34 0 l -17 30 Z" fill="{GOLD_L}"/>')
    if gesture == "raise":
        g.append(f'<path d="M -120 100 Q -168 190 -118 250" stroke="url(#suit)" stroke-width="50" fill="none" stroke-linecap="round"/>')
        g.append(hand(-118, 252, 23))
        g.append(f'<path d="M 120 100 Q 184 60 150 -30" stroke="url(#suit)" stroke-width="50" fill="none" stroke-linecap="round"/>')
        g.append(f'<circle cx="150" cy="-30" r="26" fill="url(#skinFm)"/>')
        g.append(f'<rect x="138" y="-78" width="16" height="40" rx="8" fill="url(#skinFm)"/>')
        g.append(f'<rect x="146" y="-44" width="12" height="22" rx="6" fill="url(#skinFm)"/>')
    elif gesture == "present":
        g.append(f'<path d="M -120 100 Q -178 180 -150 250" stroke="url(#suit)" stroke-width="50" fill="none" stroke-linecap="round"/>')
        g.append(hand(-150, 250, 24))
        g.append(f'<path d="M 120 100 Q 150 200 60 250" stroke="url(#suit)" stroke-width="50" fill="none" stroke-linecap="round"/>')
        g.append(f'<ellipse cx="60" cy="250" rx="30" ry="20" fill="url(#skinFm)" stroke="{SKIN_SH}" stroke-width="2"/>')
    else:
        g.append(f'<path d="M -120 100 Q -176 190 -110 250" stroke="url(#suit)" stroke-width="50" fill="none" stroke-linecap="round"/>')
        g.append(f'<path d="M 120 100 Q 176 190 110 250" stroke="url(#suit)" stroke-width="50" fill="none" stroke-linecap="round"/>')
        g.append(hand(-110, 250, 24))
        g.append(hand(110, 250, 24))
    g.append(f'<path d="M 60 26 Q 172 64 160 260 L 100 260 Q 116 90 60 36 Z" fill="#000000" opacity="0.12"/>')
    g.append(f'<path d="M -24 -22 q 24 30 48 0 l 0 56 q -24 22 -48 0 Z" fill="url(#skinFm)"/>')
    g.append(f'<path d="M -24 28 q 24 18 48 0 l 0 8 q -24 16 -48 0 Z" fill="{SKIN_SH}" opacity="0.5"/>')
    g.append(f'<circle cx="0" cy="-60" r="86" fill="url(#skinFm)"/>')
    g.append(f'<circle cx="-84" cy="-54" r="15" fill="url(#skinFm)"/>')
    g.append(f'<circle cx="84" cy="-54" r="15" fill="url(#skinFm)"/>')
    g.append(f'<path d="M -86 -52 Q -94 -150 0 -150 Q 94 -150 86 -52 '
             f'Q 72 -86 40 -92 L 26 -110 Q 0 -98 -30 -96 Q -72 -90 -86 -52 Z" fill="{HAIR}"/>')
    g.append(f'<path d="M -86 -52 Q -88 -120 -30 -144 Q -64 -104 -64 -60 Z" fill="{HAIR_L}" opacity="0.5"/>')
    g.append(f'<path d="M -70 -30 Q -60 40 0 52 Q 60 40 70 -30 Q 50 6 0 8 Q -50 6 -70 -30 Z" fill="{HAIR}" opacity="0.18"/>')
    g.append(f'<path d="M -50 -70 q 18 -10 34 -2" stroke="{HAIR}" stroke-width="7" fill="none" stroke-linecap="round"/>')
    g.append(f'<path d="M 16 -72 q 16 -8 34 2" stroke="{HAIR}" stroke-width="7" fill="none" stroke-linecap="round"/>')
    g.append(f'<rect x="-58" y="-66" width="50" height="44" rx="14" fill="#ffffff" opacity="0.12" stroke="{NAVY_D}" stroke-width="6"/>')
    g.append(f'<rect x="8" y="-66" width="50" height="44" rx="14" fill="#ffffff" opacity="0.12" stroke="{NAVY_D}" stroke-width="6"/>')
    g.append(f'<line x1="-8" y1="-46" x2="8" y2="-46" stroke="{NAVY_D}" stroke-width="6"/>')
    g.append(f'<line x1="-58" y1="-50" x2="-84" y2="-54" stroke="{NAVY_D}" stroke-width="6"/>')
    g.append(f'<line x1="58" y1="-50" x2="84" y2="-54" stroke="{NAVY_D}" stroke-width="6"/>')
    for ex in (-33, 33):
        g.append(f'<circle cx="{ex+look}" cy="-46" r="6.5" fill="#2a2018"/>')
        g.append(f'<circle cx="{ex+look+2}" cy="-48" r="2.2" fill="#fff"/>')
    g.append(f'<path d="M 0 -44 q 9 14 -2 20" stroke="{SKIN_SH}" stroke-width="4" fill="none" stroke-linecap="round"/>')
    g.append(f'<path d="M -24 -10 q 24 20 48 0" stroke="#7a4a3a" stroke-width="5" fill="none" stroke-linecap="round"/>')
    g.append('</g>')
    return "".join(g)


# ============================ BALAO + RABICHO ============================
def bubble(x, y, w, text, target, accent=None, sub=None, max_chars=30, fs=33):
    lines = wrap(text, max_chars)
    lh = fs + 13
    padx, padt, padb = 34, 30, 30
    head_h = (fs + 24) if accent else 0
    sub_h = (fs + 4) if sub else 0
    h = padt + head_h + lh * len(lines) + sub_h + padb
    bx, by, bw, bh = x, y, w, h

    # rabicho curto e direcional, ancorado no falante (sem perfurar o rosto)
    tx, ty = target
    base_cx = clamp(tx, bx + 54, bx + bw - 54)
    half = 28
    base_y = by + bh - 8
    dx, dy = (tx - base_cx), (ty - base_y)
    dist = math.hypot(dx, dy) or 1.0
    L = 100
    apex_x = base_cx + dx / dist * L
    apex_y = base_y + dy / dist * L
    # parar logo acima do topo da cabeca (ty), nunca invadindo o rosto
    if apex_y > ty - 6:
        t = (ty - 6 - base_y) / dy if dy else 1.0
        apex_x = base_cx + dx * t
        apex_y = ty - 6

    s = []
    s.append(soft_shadow(bx + bw/2, by + bh + 8, bw/2 - 12, 18, 0.16))
    # corpo
    s.append(f'<rect x="{bx}" y="{by}" rx="30" ry="30" width="{bw}" height="{bh}" fill="url(#bub)" stroke="{NAVY}" stroke-width="5"/>')
    # rabicho: preenchimento cobre a emenda, depois os dois traços laterais
    s.append(f'<path d="M {base_cx-half} {base_y} L {base_cx+half} {base_y} L {apex_x} {apex_y} Z" fill="url(#bub)"/>')
    s.append(f'<path d="M {base_cx-half} {base_y} L {apex_x} {apex_y} L {base_cx+half} {base_y}" '
             f'fill="none" stroke="{NAVY}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>')

    ty2 = by + padt + fs
    if accent:
        s.append(f'<text x="{bx+bw/2}" y="{ty2}" font-family="Poppins" font-size="{fs+5}" font-weight="800" '
                 f'fill="{GOLD_D}" text-anchor="middle" letter-spacing="0.5">{esc(accent)}</text>')
        ty2 += head_h
    for ln in lines:
        s.append(f'<text x="{bx+bw/2}" y="{ty2}" font-family="Poppins" font-size="{fs}" font-weight="600" '
                 f'fill="{INK}" text-anchor="middle">{esc(ln)}</text>')
        ty2 += lh
    if sub:
        s.append(f'<text x="{bx+bw/2}" y="{ty2+6}" font-family="Poppins" font-size="{fs-3}" font-weight="800" '
                 f'fill="{GOLD_D}" text-anchor="middle" letter-spacing="1">{esc(sub)}</text>')
    return "".join(s)


# ============================ PAINEL ============================
def panel(num, body, total=4):
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">']
    p.append(defs())
    p.append(f'<rect width="{W}" height="{H}" fill="{NAVY}"/>')
    p.append(f'<clipPath id="inner"><rect x="26" y="26" width="{W-52}" height="{H-52}" rx="28"/></clipPath>')
    p.append(f'<g clip-path="url(#inner)">')
    p.append(body)
    # rodape (sem assinatura): tema da aula + indicador de pagina
    fy = H - 112
    p.append(f'<rect x="26" y="{fy}" width="{W-52}" height="{H-fy-26}" fill="url(#ribbon)"/>')
    p.append(f'<rect x="26" y="{fy}" width="{W-52}" height="5" fill="url(#gold)"/>')
    p.append(f'<text x="64" y="{fy+54}" font-family="Poppins" font-size="26" font-weight="800" '
             f'fill="{GOLD_L}" letter-spacing="3">RESPONSABILIDADE CIVIL</text>')
    p.append(f'<rect x="{W-150}" y="{fy+26}" width="98" height="36" rx="18" fill="none" stroke="{GOLD}" stroke-width="2"/>')
    p.append(f'<text x="{W-101}" y="{fy+51}" font-family="Poppins" font-size="22" font-weight="700" '
             f'fill="{GOLD_L}" text-anchor="middle">{num} / {total}</text>')
    p.append('</g>')
    p.append(f'<rect x="26" y="26" width="{W-52}" height="{H-52}" rx="28" fill="none" stroke="url(#gold)" stroke-width="7"/>')
    p.append('</svg>')
    return "".join(p)


# ============================ MONTAGEM ============================
# posicoes base (cabecas relativamente altas p/ headroom dos baloes)
W_CX, W_BASE = 318, 712
L_CX, L_BASE = 775, 706


def build():
    panels = []
    mouth_w = lambda sc=1.0: head_top_of(W_CX, W_BASE, sc, 142)
    mouth_l = lambda sc=1.0: head_top_of(L_CX, L_BASE, sc, 146)

    # ---- 1: diarista pergunta ----
    b = office_background()
    b += woman(W_CX, W_BASE, 1.0, look=6)
    b += lawyer(L_CX, L_BASE, 1.0, gesture="rest", look=-6)
    b += desk_front(desk_items())
    b += bubble(70, 70, 575,
                "Doutor, e se eu quebrar um vaso sem querer na casa onde trabalho? Sou obrigada a indenizar o prejuízo?",
                target=mouth_w(1.0), accent=None, max_chars=27, fs=33)
    panels.append(panel(1, b))

    # ---- 2: a regra (responsabilidade subjetiva) ----
    b = office_background()
    b += woman(W_CX, W_BASE, 0.95, look=8)
    b += lawyer(L_CX, L_BASE, 1.0, gesture="raise", look=-8)
    b += desk_front(desk_items())
    b += bubble(175, 66, 830,
                "Em regra ela é SUBJETIVA: só indeniza quem causa um dano agindo com culpa (negligência, imprudência, imperícia) ou dolo. (arts. 186 e 927 do Código Civil)",
                target=mouth_l(1.0), accent="A RESPONSABILIDADE CIVIL", max_chars=34, fs=31)
    panels.append(panel(2, b))

    # ---- 3: os elementos ----
    b = office_background()
    b += woman(W_CX, W_BASE, 0.95, look=8)
    b += lawyer(L_CX, L_BASE, 1.0, gesture="raise", look=-8)
    b += desk_front(desk_items())
    b += bubble(150, 66, 855,
                "Sem culpa, não há ato ilícito. Um acidente involuntário, sozinho, não gera o dever de indenizar. É preciso reunir:",
                target=mouth_l(1.0), accent="PARA TER QUE INDENIZAR",
                sub="CONDUTA  ·  DANO  ·  NEXO CAUSAL  ·  CULPA", max_chars=34, fs=31)
    panels.append(panel(3, b))

    # ---- 4: na pratica + alivio ----
    b = office_background()
    b += woman(W_CX, W_BASE, 1.0, look=6)
    b += lawyer(L_CX, L_BASE, 1.0, gesture="present", look=-6)
    b += desk_front(desk_items())
    b += bubble(165, 60, 840,
                "No emprego, o risco do negócio é do empregador (princípio da alteridade). Sem dolo ou culpa, a quebra não pode ser descontada do seu salário (art. 462, CLT).",
                target=mouth_l(1.0), accent="NA PRÁTICA", max_chars=34, fs=31)
    b += bubble(70, 398, 360, "Que alívio!", target=mouth_w(1.0), accent=None, max_chars=16, fs=32)
    panels.append(panel(4, b))

    return panels


if __name__ == "__main__":
    for i, svg in enumerate(build(), 1):
        out = os.path.join(OUT, f"quadrinho_{i}.png")
        cairosvg.svg2png(bytestring=svg.encode("utf-8"), write_to=out,
                         output_width=1080, output_height=1350)
        print("ok ->", out)
    print("Concluido.")
