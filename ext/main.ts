// Global resources
const extensions: (Extension | null)[] = []

class Extension {
  tab: ext.tabs.Tab
  window: ext.windows.Window
  webview: ext.webviews.Webview
  websession: ext.websessions.Websession

  constructor(
    tab: ext.tabs.Tab,
    window: ext.windows.Window,
    webview: ext.webviews.Webview,
    websession: ext.websessions.Websession,
  ) {
    this.tab = tab
    this.window = window
    this.webview = webview
    this.websession = websession
  }
}

function getExtIndex(): number {
  const gapIndexInExtArray = extensions.findIndex((value: Extension | null) => value === null)

  return gapIndexInExtArray !== -1 ? gapIndexInExtArray : extensions.length
}

function getDarkModeIcon(isDarkMode: boolean) {
  return isDarkMode ? 'icons/icon-128-dark.png' : 'icons/icon-128.png'
}

// Extension clicked
ext.runtime.onExtensionClick.addListener(async () => {
  try {
    const extIndex = getExtIndex()

    const extNumber = extIndex + 1
    const extTitleWithId = `TLDraw - #${extNumber}`
    
    const isDarkMode = await ext.windows.getPlatformDarkMode()
    const icon = getDarkModeIcon(isDarkMode)

    // Create tab
    const tab = await ext.tabs.create({
      icon: 'icons/icon-128.png',
      icon_dark: 'icons/icon-128-dark.png',
      text: extTitleWithId,
      closable: true
    })

    // Create window
    const window = await ext.windows.create({
      title: extTitleWithId,
      icon,
      fullscreenable: true,
      vibrancy: false,
      frame: true,
    })

    // Create websession
    const websession = await ext.websessions.create({
      partition: extTitleWithId,
      persistent: true,
      global: false,
      cache: true
    })
    
    // Create webview
    const size = await ext.windows.getContentSize(window.id)
    
    const webview = await ext.webviews.create({
      window: window,
      websession: websession,
      bounds: { x: 0, y: 0, width: size.width, height: size.height },
      autoResize: { width: true, height: true }
    })

    await ext.webviews.loadFile(webview.id, 'index.html')

    const extention = new Extension(
      tab,
      window,
      webview,
      websession,
    )

    extensions[extIndex] = extention
  } catch (error) {
    console.error('ext.runtime.onExtensionClick', JSON.stringify(error))
  }
})

// Tab was removed by another extension
ext.tabs.onRemoved.addListener(async (event) => {
  try {
    const extIndex = extensions.findIndex(
      (value: Extension | null) =>
        value !== null && value.tab.id === event.id
    )

    if (extIndex === -1) return

    const extension = extensions[extIndex]

    await ext.windows.remove(extension!.window.id)
    await ext.webviews.remove(extension!.webview.id)
    
    extensions[extIndex] = null
  } catch (error) {
    console.error('ext.tabs.onRemoved', JSON.stringify(error))
  }
})

// Tab was clicked
ext.tabs.onClicked.addListener(async (event) => {
  try {
    const extIndex = extensions.findIndex(
      (value: Extension | null) =>
        value !== null && value.tab.id === event.id
    )

    if (extIndex === -1) return

    const extension = extensions[extIndex]

    await ext.windows.restore(extension!.window.id)
    await ext.windows.focus(extension!.window.id)
  } catch (error) {
    console.error('ext.tabs.onClicked', JSON.stringify(error))
  }
})

// Tab was closed
ext.tabs.onClickedClose.addListener(async (event) => {
  try {
    const extIndex = extensions.findIndex(
      (value: Extension | null) =>
        value !== null && value.tab.id === event.id
    )

    if (extIndex === -1) return

    const extension = extensions[extIndex]

    await ext.tabs.remove(extension!.tab.id)
    await ext.windows.remove(extension!.window.id)
    await ext.webviews.remove(extension!.webview.id)

    extensions[extIndex] = null
  } catch (error) {
    console.error('ext.tabs.onClickedClose', JSON.stringify(error))
  }
})

// Window was removed by another extension
ext.windows.onRemoved.addListener(async (event) => {
  try {
    const extIndex = extensions.findIndex(
      (value: Extension | null) =>
        value !== null && value.window.id === event.id
    )

    if (extIndex === -1) return

    const extension = extensions[extIndex]

    await ext.tabs.remove(extension!.tab.id)
    await ext.webviews.remove(extension!.webview.id)

    extensions[extIndex] = null
  } catch (error) {
    console.error('ext.windows.onRemoved', JSON.stringify(error))
  }
})

// Window was closed
ext.windows.onClosed.addListener(async (event) => {
  try {
    const extIndex = extensions.findIndex(
      (value: Extension | null) =>
        value !== null && value.window.id === event.id
    )

    if (extIndex === -1) return

    const extension = extensions[extIndex]

    // Remove objects
    await ext.tabs.remove(extension!.tab.id)
    await ext.webviews.remove(extension!.webview.id)

    extensions[extIndex] = null
  } catch (error) {
    console.error('ext.windows.onClosed', JSON.stringify(error))
  }
})

ext.windows.onUpdatedDarkMode.addListener(async (_, details: ext.windows.EventDarkMode) => {
  try {
    const icon = getDarkModeIcon(details.enabled)

    extensions.forEach(async (value: Extension | null) => {
      if (!value) return

      await ext.windows.setIcon(value.window.id, icon)
    })

  } catch (error) {
    console.error('ext.windows.onUpdatedDarkMode', JSON.stringify(error))
  }
})
