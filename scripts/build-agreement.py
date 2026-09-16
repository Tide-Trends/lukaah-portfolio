"""Build a faithful, printable PDF from the agreement's actual HTML content."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT=Path(__file__).resolve().parents[1]
class Node:
    def __init__(self,tag='',attrs=()): self.tag=tag; self.attrs=dict(attrs); self.children=[]
    def text(self): return ''.join(c if isinstance(c,str) else c.text() for c in self.children)
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.root=Node(); self.stack=[self.root]
    def handle_starttag(self,tag,attrs):
        node=Node(tag,attrs); self.stack[-1].children.append(node)
        if tag not in {'meta','link','input','br','img','hr'}: self.stack.append(node)
    def handle_startendtag(self,tag,attrs): self.handle_starttag(tag,attrs)
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag: self.stack=self.stack[:i]; break
    def handle_data(self,data): self.stack[-1].children.append(data)
def find(node,tag=None,cls=None):
    if isinstance(node,str): return None
    if (tag is None or node.tag==tag) and (cls is None or cls in node.attrs.get('class','').split()):return node
    for c in node.children:
        result=find(c,tag,cls)
        if result:return result

def inline(node):
    if isinstance(node,str):return escape(node)
    content=''.join(inline(c) for c in node.children)
    if node.tag in {'strong','b'}:return '<b>'+content+'</b>'
    if node.tag in {'em','i'}:return '<i>'+content+'</i>'
    if node.tag=='br':return '<br/>'
    return content
for family,file in [('Body','Arial.ttf'),('BodyBold','Arial Bold.ttf'),('BodyItalic','Arial Italic.ttf')]:
    pdfmetrics.registerFont(TTFont(family,'/System/Library/Fonts/Supplemental/'+file))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='BodyBold',italic='BodyItalic',boldItalic='BodyBold')
body=ParagraphStyle('body',fontName='Body',fontSize=9.5,leading=13.6,spaceAfter=7,textColor=colors.HexColor('#171714'))
styles={
    'p':body,
    'h1':ParagraphStyle('h1',parent=body,fontName='BodyBold',fontSize=27,leading=31,spaceAfter=12),
    'h2':ParagraphStyle('h2',parent=body,fontName='BodyBold',fontSize=11.2,leading=15,spaceBefore=16,spaceAfter=8,keepWithNext=True),
    'h3':ParagraphStyle('h3',parent=body,fontName='BodyBold',fontSize=10,leading=14,spaceBefore=9,spaceAfter=5,keepWithNext=True),
    'small':ParagraphStyle('small',parent=body,fontSize=8,leading=11,textColor=colors.HexColor('#62625b')),
    'li':ParagraphStyle('li',parent=body,leftIndent=13,firstLineIndent=-9,spaceAfter=3),
}
p=Parser();p.feed((ROOT/'ritual-fitness-agreement.html').read_text());wrap=find(p.root,'div','wrap')
story=[Paragraph('LUKAAH / WEBSITE AGREEMENT',styles['small'])]
for n in wrap.children:
    if isinstance(n,str):continue
    if n.tag=='header':
        story.append(Paragraph(inline(find(n,'h1')),styles['h1']))
        story.append(Paragraph(inline(find(n,'p')),body))
        story.append(Paragraph('Online agreement &amp; deposit payment: <link href="https://lukaah.com/ritual-fitness-agreement.html" color="#a13d2a">lukaah.com/ritual-fitness-agreement.html</link>',styles['small']))
    elif n.attrs.get('class')=='money':
        rows=[]
        cells=[c for c in n.children if isinstance(c,Node) and c.tag=='div']
        for i in range(0,len(cells),2):
            rows.append([Paragraph(inline(find(c,'span'))+'<br/><b>'+inline(find(c,'b'))+'</b>',body) for c in cells[i:i+2]])
        table=Table(rows,colWidths=[255,255]);table.setStyle(TableStyle([('BOX',(0,0),(-1,-1),.7,colors.HexColor('#181916')),('INNERGRID',(0,0),(-1,-1),.4,colors.HexColor('#cbc9be')),('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#f3f1e8')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),5)]));story.extend([Spacer(1,9),table,Spacer(1,7)])
    elif n.tag in ['h2','h3','p']:
        story.append(Paragraph(inline(n),styles[n.tag]))
    elif n.tag=='ul':
        # Keep a short list with its lead-in rather than stranding one bullet.
        if story and isinstance(story[-1], Paragraph):
            story[-1].style = ParagraphStyle("listLead", parent=story[-1].style, keepWithNext=True)
        bullets=[Paragraph('&#8226; '+inline(li),styles['li']) for li in n.children if isinstance(li,Node) and li.tag=='li']
        story.append(KeepTogether(bullets))
    elif n.tag=='table':
        rows=[]
        def collect(node):
            if isinstance(node,str):return
            if node.tag=='tr':rows.append([Paragraph(inline(c),body) for c in node.children if isinstance(c,Node) and c.tag in ['td','th']])
            else:
                for c in node.children:collect(c)
        collect(n)
        table=Table(rows,colWidths=[372,138],repeatRows=1,hAlign='LEFT');table.setStyle(TableStyle([('LINEBELOW',(0,0),(-1,-1),.35,colors.HexColor('#cbc9be')),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#f3f1e8')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),3)]));story.append(table)
    elif n.attrs.get('id')=='agree':
        story.append(Paragraph('Agree and pay the deposit',styles['h2']))
        para=next(c for c in n.children if isinstance(c,Node) and c.tag=='p')
        story.append(Paragraph(inline(para),body))
        label=find(n,'label')
        story.append(Paragraph(inline(label),body))
        story.append(Paragraph('Typed name: ____________________________________________',body))
        story.append(Paragraph('Email: _________________________________________________',body))
        story.append(Paragraph('Complete deposit payment through the online agreement at <link href="https://lukaah.com/ritual-fitness-agreement.html" color="#a13d2a">lukaah.com/ritual-fitness-agreement.html</link>. This downloaded copy is not proof of payment.',styles['small']))

def page(canvas,doc):
    canvas.saveState();canvas.setFont('Body',8);canvas.setFillColor(colors.HexColor('#62625b'))
    if doc.page>1:canvas.drawString(51,758,'LUKAAH / RITUAL FITNESS HAWAII / WEBSITE AGREEMENT')
    canvas.setStrokeColor(colors.HexColor('#cbc9be'));canvas.line(51,39,561,39)
    canvas.drawString(51,26,'lukaah.com  |  Ritual Fitness Hawaii  |  Agreement v2 - September 15, 2026')
    canvas.drawRightString(561,26,str(doc.page));canvas.restoreState()
path=ROOT/'assets/documents/ritual-fitness-agreement.pdf'
SimpleDocTemplate(str(path),pagesize=letter,leftMargin=51,rightMargin=51,topMargin=53,bottomMargin=56,title='Ritual Fitness Hawaii - Website Agreement',author='Lukaah').build(story,onFirstPage=page,onLaterPages=page)
print(path)
