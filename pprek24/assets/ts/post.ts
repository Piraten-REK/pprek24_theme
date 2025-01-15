for (const element of Array.from(document.querySelectorAll('.post-content pre:has(> code)') as NodeListOf<HTMLPreElement>)) {
  const code = Array.from(element.children).find(el => el.tagName.toLowerCase() === 'code') as HTMLElement
  const lines = code.innerText.split(/\r?\n/)

  const wrapper = document.createElement('div')
  wrapper.className = 'code-block-line-number-wapper'
  wrapper.ariaHidden = 'true'

  code.textContent = ''

  for (
    let line = 1, content = lines[0];
    line <= lines.length;
    content = lines[line++]
  ) {
    const contentEl = document.createElement('span')
    contentEl.className = 'code-block-content'
    const txt = document.createTextNode(content + '\n')
    contentEl.append(txt)

    const lineEl = document.createElement('span')
    lineEl.className = 'code-block-line-number'
    lineEl.textContent = line.toString()
    function clickHandler ({ type }: MouseEvent): void {
      const selection = document.getSelection()
      if (selection == null) return

      if (selection.rangeCount > 0) {
        selection.removeAllRanges()
      }
      
      const range = document.createRange()
      const startOffset = type === 'dblclick'
        ? 0
        : content?.match(/^\s*/)?.[0]?.length ?? 0
      const endOffset = type === 'dblclick'
        ? content.length
        : content.length - (content?.match(/\s*$/)?.[0]?.length ?? 0)

      range.setStart(txt, startOffset)
      range.setEnd(txt, endOffset)


      selection.addRange(range)

    }
    lineEl.addEventListener('click', clickHandler)
    lineEl.addEventListener('dblclick', clickHandler)

    code.append(contentEl)
    wrapper.append(lineEl)
  }

  element.prepend(wrapper)
}
