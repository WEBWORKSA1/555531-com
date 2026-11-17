"""Generates the social-share image and app icons (binary files) for the site.
Run locally:  pip install pillow && python .github/scripts/make_images.py"""
from PIL import Image, ImageDraw, ImageFont
import glob
def find(name):
    hits=glob.glob('/usr/share/fonts/**/'+name,recursive=True)
    return hits[0] if hits else None
def font(name,size):
    p=find(name)
    return ImageFont.truetype(p,size) if p else ImageFont.load_default()
W,H=1200,630
im=Image.new('RGB',(W,H),'#0b1020');d=ImageDraw.Draw(im)
for r,c in [(520,(40,30,10)),(380,(60,42,8))]:
    d.ellipse((W-r-40,-r//2,W+r-40,r+r//2-200),fill=c)
x,y=80,90
for i,ch in enumerate('5555'):
    d.rounded_rectangle((x+i*92,y,x+i*92+80,y+100),18,fill='#1b2550')
    d.text((x+i*92+40,y+50),ch,font=font('DejaVuSansMono-Bold.ttf',60),fill='#e9ecf8',anchor='mm')
d.rounded_rectangle((x+368,y,x+498,y+100),18,fill='#ffb627')
d.text((x+433,y+50),'31',font=font('DejaVuSansMono-Bold.ttf',60),fill='#1a1203',anchor='mm')
d.text((80,250),'Know who’s calling.',font=font('DejaVuSans-Bold.ttf',70),fill='#e9ecf8')
d.text((80,335),'Stop who shouldn’t.',font=font('DejaVuSans-Bold.ttf',70),fill='#ffb627')
d.text((80,440),'Free number inspector · scam call checker · 31-day quiet line',font=font('DejaVuSans.ttf',30),fill='#a3abcb')
d.text((80,540),'555531 — The Number Desk',font=font('DejaVuSans-Bold.ttf',34),fill='#2ee59d')
im.save('assets/img/og.png',optimize=True)
for s in (192,512):
    ic=Image.new('RGB',(s,s),'#0b1020');dd=ImageDraw.Draw(ic);k=s/64
    dd.rounded_rectangle((6*k,6*k,58*k,58*k),12*k,fill='#1b2550')
    dd.text((32*k,23*k),'555',font=font('DejaVuSansMono-Bold.ttf',int(17*k)),fill='#e9ecf8',anchor='mm')
    dd.rounded_rectangle((14*k,36*k,50*k,54*k),5*k,fill='#ffb627')
    dd.text((32*k,45*k),'31',font=font('DejaVuSansMono-Bold.ttf',int(15*k)),fill='#1a1203',anchor='mm')
    ic.save(f'assets/img/icon-{s}.png',optimize=True)
print('images built')
