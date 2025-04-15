
const shorts_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path clip-rule="evenodd" d="m7.61 15.719.392-.22v-2.24l-.534-.228-.942-.404c-.869-.372-1.4-1.15-1.446-1.974-.047-.823.39-1.642 1.203-2.097h.001L15.13 3.59c1.231-.689 2.785-.27 3.466.833.652 1.058.313 2.452-.879 3.118l-1.327.743-.388.217v2.243l.53.227.942.404c.869.372 1.4 1.15 1.446 1.974.047.823-.39 1.642-1.203 2.097l-.002.001-8.845 4.964-.001.001c-1.231.688-2.784.269-3.465-.834-.652-1.058-.313-2.451.879-3.118l1.327-.742Zm1.993 6.002c-1.905 1.066-4.356.46-5.475-1.355-1.057-1.713-.548-3.89 1.117-5.025a4.14 4.14 0 01.305-.189l1.327-.742-.942-.404a4.055 4.055 0 01-.709-.391c-.963-.666-1.578-1.718-1.644-2.877-.08-1.422.679-2.77 1.968-3.49l8.847-4.966c1.905-1.066 4.356-.46 5.475 1.355 1.057 1.713.548 3.89-1.117 5.025a4.074 4.074 0 01-.305.19l-1.327.742.942.403c.253.109.49.24.709.392.963.666 1.578 1.717 1.644 2.876.08 1.423-.679 2.77-1.968 3.491l-8.847 4.965ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z" fill-rule="evenodd"></path></svg>`

const shorts_icon_fill = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path clip-rule="evenodd" d="M18.45 8.851c1.904-1.066 2.541-3.4 1.422-5.214-1.119-1.814-3.57-2.42-5.475-1.355L5.55 7.247c-1.29.722-2.049 2.069-1.968 3.491.081 1.423.989 2.683 2.353 3.268l.942.404-1.327.742c-1.904 1.066-2.541 3.4-1.422 5.214 1.119 1.814 3.57 2.421 5.475 1.355l8.847-4.965c1.29-.722 2.049-2.068 1.968-3.49-.081-1.423-.989-2.684-2.353-3.269l-.942-.403 1.327-.743ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z" fill-rule="evenodd"></path></svg>`

const MaterialIcons = {
    rounded: {
      home: "material-symbols-rounded",
      search: "material-symbols-rounded",
      subscriptions: "material-symbols-rounded",
      smart_display: "material-symbols-rounded",
      forum: "material-symbols-rounded",
      account_circle: "material-symbols-rounded",
      history: "material-symbols-rounded",
      playlist_play: "material-symbols-rounded",
      shorts: shorts_icon,
      schedule: "material-symbols-rounded",
      thumb_up: "material-symbols-rounded",
      thumb_down: "material-symbols-rounded",
    },
    
    filled: {
      thumb_up: "material-symbols",
      thumb_down: "material-symbols",
      home: "material-symbols",
      search: "material-symbols",
      subscriptions: "material-symbols",
      smart_display: "material-symbols",
      forum: "material-symbols",
      account_circle: "material-symbols",
      history: "material-symbols",
      playlist_play: "material-symbols",
      play_circle: "material-symbols",
      shorts: shorts_icon_fill,
      schedule: "material-symbols",
    },
  };
  
export default MaterialIcons;
  