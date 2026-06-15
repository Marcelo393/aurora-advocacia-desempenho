#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera 4 quadrinhos (1080x1080) para carrossel de Instagram.
Tema: empregada domestica x responsabilidade civil por quebra de objetos.
Saida: PNGs separados em /quadrinhos.
"""
import os
import cairosvg

W = H = 1080
OUT = os.path.join(os.path.dirname(__file__), "..", "quadrinhos")
os.makedirs(OUT, exist_ok=True)

# Paleta
NAVY = "#16263f"
NAVY2 = "#1f3career".replace("career", "355a")  # noop guard
NAVY2 = "#22395c"
GOLD = "#c9a24b"
GOLD_D = "#a8853a"
CREAM = "#f6f1e7"
SKIN = "#f0c9a8"
SKIN2 = "#e3b08a"
HAIR = "#3a2a1d"
WHITE = "#ffffff"
INK = "#1b1b1b"


def esc(t):
    return (t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def wrap(text, max_chars):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        if len(cur) + len(w) + (1 if cur else 0) <= max_chars:
            cur = (cur + " " + w).strip()
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def bubble(x, y, w, text, max_chars=26, fs=33, tail="left", fill=WHITE, tcolor=INK, bold_first=False):
    """Balao de fala arredondado com rabicho."""
    lines = wrap(text, max_chars)
    lh = fs + 12
    pad = 28
    h = pad * 2 + lh * len(lines)
    s = []
    s.append(f'<rect x="{x}" y="{y}" rx="34" ry="34" width="{w}" height="{h}" '
             f'fill="{fill}" stroke="{NAVY}" stroke-width="5"/>')
    # rabicho
    if tail == "left":
        tx = x + 60
        s.append(f'<path d="M {tx} {y+h-6} l -34 56 l 70 -34 Z" fill="{fill}" stroke="{NAVY}" stroke-width="5" stroke-linejoin="round"/>')
        s.append(f'<rect x="{tx-6}" y="{y+h-14}" width="80" height="14" fill="{fill}"/>')
    elif tail == "right":
        tx = x + w - 90
        s.append(f'<path d="M {tx} {y+h-6} l 70 56 l -36 -36 Z" fill="{fill}" stroke="{NAVY}" stroke-width="5" stroke-linejoin="round"/>')
        s.append(f'<rect x="{tx-6}" y="{y+h-14}" width="80" height="14" fill="{fill}"/>')
    ty = y + pad + fs
    for i, ln in enumerate(lines):
        weight = "700" if (bold_first and i == 0) else "600"
        s.append(f'<text x="{x+w/2}" y="{ty}" font-family="DejaVu Sans" font-size="{fs}" '
                 f'font-weight="{weight}" fill="{tcolor}" text-anchor="middle">{esc(ln)}</text>')
        ty += lh
    return "".join(s), h


def woman(cx, cy, scale=1.0, flip=False):
    """Empregada domestica: cabelo preso, avental, sorriso."""
    t = f'translate({cx} {cy}) scale({"-1" if flip else "1"} 1) scale({scale})'
    p = f'<g transform="{t}">'
    # corpo / vestido
    p += f'<path d="M -120 360 Q -130 150 0 120 Q 130 150 120 360 Z" fill="#3f7d8c"/>'
    # avental
    p += f'<path d="M -70 360 L -70 175 Q 0 150 70 175 L 70 360 Z" fill="{CREAM}" stroke="#d8cdb6" stroke-width="3"/>'
    p += f'<path d="M -40 150 L -40 120 M 40 150 L 40 120" stroke="{CREAM}" stroke-width="14" fill="none"/>'
    # bolso avental
    p += f'<rect x="-40" y="250" width="80" height="56" rx="8" fill="none" stroke="#d8cdb6" stroke-width="4"/>'
    # bracos
    p += f'<path d="M -108 175 Q -150 250 -120 320" stroke="#3f7d8c" stroke-width="40" fill="none" stroke-linecap="round"/>'
    p += f'<path d="M 108 175 Q 150 250 120 320" stroke="#3f7d8c" stroke-width="40" fill="none" stroke-linecap="round"/>'
    p += f'<circle cx="-122" cy="322" r="22" fill="{SKIN}"/>'
    p += f'<circle cx="122" cy="322" r="22" fill="{SKIN}"/>'
    # pescoco
    p += f'<rect x="-22" y="60" width="44" height="60" fill="{SKIN2}"/>'
    # cabeca
    p += f'<circle cx="0" cy="20" r="78" fill="{SKIN}"/>'
    # cabelo preso (coque)
    p += f'<path d="M -80 18 Q -86 -78 0 -78 Q 86 -78 80 18 Q 60 -30 0 -34 Q -60 -30 -80 18 Z" fill="{HAIR}"/>'
    p += f'<circle cx="0" cy="-72" r="26" fill="{HAIR}"/>'
    # olhos
    p += f'<circle cx="-28" cy="14" r="7" fill="{INK}"/>'
    p += f'<circle cx="28" cy="14" r="7" fill="{INK}"/>'
    # sobrancelhas
    p += f'<path d="M -40 -2 q 12 -8 24 0" stroke="{HAIR}" stroke-width="5" fill="none" stroke-linecap="round"/>'
    p += f'<path d="M 16 -2 q 12 -8 24 0" stroke="{HAIR}" stroke-width="5" fill="none" stroke-linecap="round"/>'
    # nariz + sorriso
    p += f'<path d="M 0 22 q 8 8 0 14" stroke="{SKIN2}" stroke-width="4" fill="none"/>'
    p += f'<path d="M -24 44 q 24 22 48 0" stroke="{INK}" stroke-width="5" fill="none" stroke-linecap="round"/>'
    # bochecha
    p += f'<circle cx="-44" cy="36" r="10" fill="#f3a98c" opacity="0.5"/>'
    p += f'<circle cx="44" cy="36" r="10" fill="#f3a98c" opacity="0.5"/>'
    p += '</g>'
    return p


def lawyer(cx, cy, scale=1.0, flip=False, gesture="open"):
    """Advogado: terno, gravata, cabelo curto."""
    t = f'translate({cx} {cy}) scale({"-1" if flip else "1"} 1) scale({scale})'
    p = f'<g transform="{t}">'
    # terno
    p += f'<path d="M -130 360 Q -140 150 0 120 Q 140 150 130 360 Z" fill="{NAVY}"/>'
    # camisa
    p += f'<path d="M -46 150 L 0 360 L 46 150 Q 0 132 -46 150 Z" fill="{WHITE}"/>'
    # lapelas
    p += f'<path d="M -46 150 L -10 138 L -18 250 Z" fill="{NAVY2}"/>'
    p += f'<path d="M 46 150 L 10 138 L 18 250 Z" fill="{NAVY2}"/>'
    # gravata
    p += f'<path d="M 0 150 L -16 178 L 0 320 L 16 178 Z" fill="{GOLD}" stroke="{GOLD_D}" stroke-width="2"/>'
    p += f'<path d="M -12 150 L 0 168 L 12 150 Z" fill="{GOLD_D}"/>'
    # bracos
    if gesture == "open":
        p += f'<path d="M -116 175 Q -168 250 -150 330" stroke="{NAVY}" stroke-width="44" fill="none" stroke-linecap="round"/>'
        p += f'<path d="M 116 175 Q 168 240 150 320" stroke="{NAVY}" stroke-width="44" fill="none" stroke-linecap="round"/>'
        p += f'<circle cx="-152" cy="332" r="24" fill="{SKIN}"/>'
        p += f'<circle cx="152" cy="322" r="24" fill="{SKIN}"/>'
    else:  # explica, mao levantada
        p += f'<path d="M -116 175 Q -150 250 -130 330" stroke="{NAVY}" stroke-width="44" fill="none" stroke-linecap="round"/>'
        p += f'<path d="M 116 175 Q 175 150 150 70" stroke="{NAVY}" stroke-width="44" fill="none" stroke-linecap="round"/>'
        p += f'<circle cx="-132" cy="332" r="24" fill="{SKIN}"/>'
        p += f'<rect x="142" y="20" width="16" height="44" rx="8" fill="{SKIN}"/>'
        p += f'<circle cx="150" cy="60" r="22" fill="{SKIN}"/>'
    # lenco no bolso
    p += f'<path d="M 70 200 l 30 0 l -15 26 Z" fill="{GOLD}"/>'
    # pescoco
    p += f'<rect x="-22" y="62" width="44" height="60" fill="{SKIN2}"/>'
    # cabeca
    p += f'<circle cx="0" cy="22" r="80" fill="{SKIN}"/>'
    # cabelo curto
    p += f'<path d="M -82 16 Q -90 -68 0 -70 Q 90 -68 82 16 Q 70 -22 40 -26 L 30 -40 Q 0 -30 -34 -28 Q -70 -24 -82 16 Z" fill="{HAIR}"/>'
    # orelhas
    p += f'<circle cx="-80" cy="28" r="13" fill="{SKIN}"/>'
    p += f'<circle cx="80" cy="28" r="13" fill="{SKIN}"/>'
    # oculos
    p += f'<circle cx="-30" cy="16" r="22" fill="none" stroke="{NAVY}" stroke-width="5"/>'
    p += f'<circle cx="30" cy="16" r="22" fill="none" stroke="{NAVY}" stroke-width="5"/>'
    p += f'<line x1="-8" y1="14" x2="8" y2="14" stroke="{NAVY}" stroke-width="5"/>'
    # olhos
    p += f'<circle cx="-30" cy="16" r="6" fill="{INK}"/>'
    p += f'<circle cx="30" cy="16" r="6" fill="{INK}"/>'
    # nariz
    p += f'<path d="M 0 24 q 9 9 0 15" stroke="{SKIN2}" stroke-width="4" fill="none"/>'
    # sorriso confiante
    p += f'<path d="M -22 48 q 22 18 44 0" stroke="{INK}" stroke-width="5" fill="none" stroke-linecap="round"/>'
    p += '</g>'
    return p


def panel(num, bg_inner, scene, bubbles, title):
    """Monta um quadrinho completo."""
    parts = []
    parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
    # fundo
    parts.append(f'<rect width="{W}" height="{H}" fill="{NAVY}"/>')
    # moldura interna
    m = 28
    parts.append(f'<rect x="{m}" y="{m}" width="{W-2*m}" height="{H-2*m}" rx="26" fill="{bg_inner}" stroke="{GOLD}" stroke-width="8"/>')
    # piso
    parts.append(f'<rect x="{m}" y="{H-300}" width="{W-2*m}" height="{300-m}" fill="#e7ddc8"/>')
    parts.append(f'<line x1="{m}" y1="{H-300}" x2="{W-m}" y2="{H-300}" stroke="#d2c5a8" stroke-width="4"/>')
    parts.append(scene)
    parts.append(bubbles)
    # faixa de titulo (rodape)
    parts.append(f'<rect x="{m}" y="{H-92}" width="{W-2*m}" height="{92-m}" fill="{NAVY}"/>')
    parts.append(f'<rect x="{m}" y="{H-92}" width="{W-2*m}" height="6" fill="{GOLD}"/>')
    parts.append(f'<text x="{W/2}" y="{H-38}" font-family="DejaVu Serif" font-size="30" font-weight="700" '
                 f'fill="{GOLD}" text-anchor="middle" letter-spacing="2">AURORA ADVOCACIA</text>')
    # numero do quadrinho
    parts.append(f'<circle cx="{W-80}" cy="80" r="34" fill="{GOLD}"/>')
    parts.append(f'<text x="{W-80}" y="92" font-family="DejaVu Serif" font-size="38" font-weight="700" fill="{NAVY}" text-anchor="middle">{num}</text>')
    parts.append('</svg>')
    return "".join(parts)


# ---------------- QUADRINHO 1 ----------------
sc1 = woman(330, 470, 1.0) + lawyer(770, 460, 1.0, flip=True, gesture="open")
b1, _ = bubble(120, 70, 520, "Doutor, e se eu quebrar algo na casa do meu patrão, sem querer, durante o trabalho?", max_chars=24, fs=34, tail="left")
b1b, _ = bubble(120, 320, 360, "Vou ter que pagar?!", max_chars=18, fs=34, tail="left")
p1 = panel(1, "#cfe3e8", sc1, b1 + b1b, "")

# ---------------- QUADRINHO 2 ----------------
sc2 = woman(290, 480, 0.92) + lawyer(760, 455, 1.05, flip=True, gesture="explain")
b2, _ = bubble(150, 60, 800, "Calma! A responsabilidade civil depende de CULPA. O art. 186 do Código Civil só obriga a indenizar quem age com dolo, negligência, imprudência ou imperícia.", max_chars=34, fs=33, tail="right")
p2 = panel(2, "#e9e2d2", sc2, b2, "")

# ---------------- QUADRINHO 3 ----------------
sc3 = woman(300, 485, 0.9) + lawyer(770, 455, 1.05, flip=True, gesture="explain")
b3, _ = bubble(140, 58, 820, "No emprego vale o princípio da ALTERIDADE (art. 2º da CLT): os riscos do negócio são do empregador. Um acidente comum, sem culpa, não pode ser descontado de você.", max_chars=34, fs=33, tail="right")
p3 = panel(3, "#dfe7d6", sc3, b3, "")

# ---------------- QUADRINHO 4 ----------------
sc4 = woman(310, 470, 1.02) + lawyer(770, 460, 1.0, flip=True, gesture="open")
b4, _ = bubble(130, 56, 820, "Só haverá desconto se houver dolo, ou culpa quando previsto no contrato (art. 462, §1º, CLT).", max_chars=34, fs=33, tail="right")
b4b, _ = bubble(150, 300, 540, "Quebra acidental do dia a dia? Pode ficar tranquila!", max_chars=24, fs=33, tail="left")
p4 = panel(4, "#f0e6d8", sc4, b4 + b4b, "")

panels = [p1, p2, p3, p4]
for i, svg in enumerate(panels, 1):
    png_path = os.path.join(OUT, f"quadrinho_{i}.png")
    cairosvg.svg2png(bytestring=svg.encode("utf-8"), write_to=png_path,
                     output_width=1080, output_height=1080)
    print("ok ->", png_path)

print("Concluido.")
