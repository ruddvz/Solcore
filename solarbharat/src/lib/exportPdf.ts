import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const FOOTER_TEXT =
  'SolarBharat.in — Estimates only. Not financial advice. Verify tariff/subsidy with DISCOM & nodal agency.'

function appendCanvasToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  opts: { addLeadingBlankPage?: boolean },
) {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 10
  const footer = 9
  const innerW = pageWidth - margin * 2
  const innerH = pageHeight - margin * 2 - footer

  const imgData = canvas.toDataURL('image/jpeg', 0.9)
  const imgHeightMm = (canvas.height * innerW) / canvas.width

  const drawFooter = () => {
    pdf.setFontSize(7)
    pdf.setTextColor(140, 140, 140)
    pdf.text(FOOTER_TEXT, margin, pageHeight - 4, { maxWidth: innerW })
  }

  if (opts.addLeadingBlankPage && pdf.getNumberOfPages() > 0) {
    pdf.addPage()
  }

  let offset = 0
  let sliceIdx = 0
  while (offset < imgHeightMm) {
    if (sliceIdx > 0) pdf.addPage()
    pdf.addImage(imgData, 'JPEG', margin, margin - offset, innerW, imgHeightMm)
    drawFooter()
    offset += innerH
    sliceIdx++
  }
}

/** Single scrolling region → PDF */
export async function exportReportElementToPdf(root: HTMLElement, fileBaseName: string): Promise<void> {
  const canvas = await html2canvas(root, {
    scale: Math.min(2, window.devicePixelRatio || 2),
    useCORS: true,
    logging: false,
    backgroundColor: '#0a0f1e',
    windowWidth: root.scrollWidth,
    windowHeight: root.scrollHeight,
  })

  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true })
  appendCanvasToPdf(pdf, canvas, {})

  const safe = fileBaseName.replace(/[^a-z0-9-_]+/gi, '-').slice(0, 80)
  pdf.save(`${safe || 'solarbharat-report'}.pdf`)
}

/** Walk each report tab, rasterise panel → merged PDF (blank page between tab sections). */
export async function exportTabSequenceToPdf(
  captureEl: HTMLElement,
  tabIds: string[],
  setTab: (id: string) => void,
  delayMs: number,
  fileBaseName: string,
): Promise<void> {
  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true })

  for (let i = 0; i < tabIds.length; i++) {
    setTab(tabIds[i])
    await new Promise((r) => setTimeout(r, delayMs))
    const canvas = await html2canvas(captureEl, {
      scale: Math.min(2, window.devicePixelRatio || 2),
      useCORS: true,
      logging: false,
      backgroundColor: '#0a0f1e',
      windowWidth: captureEl.scrollWidth,
      windowHeight: captureEl.scrollHeight,
    })
    appendCanvasToPdf(pdf, canvas, { addLeadingBlankPage: i > 0 })
  }

  const safe = fileBaseName.replace(/[^a-z0-9-_]+/gi, '-').slice(0, 80)
  pdf.save(`${safe || 'solarbharat-report'}-full.pdf`)
}
