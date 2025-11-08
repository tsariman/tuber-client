import type { IBookmark } from './tuber.interfaces';

const BOOKMARK_LIST: IBookmark[] = [
  {
    // href: '#create-property',
    // id: 'create-property',
    // src: 'https://www.youtube.com/embed/b4rJHM27RPk?start=872&autoplay=1',
    platform: 'youtube',
    videoid: 'b4rJHM27RPk',
    startSeconds: 872,
    title: 'How to create a property.',
    note: `Properties are variables that are stored in the save file. They 
           are useful for storing data that needs to persist between game 
           sessions.`,
  }, {
    // href: '#best-way-to-test-script',
    // id: 'best-way-to-test-script',
    // src: 'https://www.youtube.com/embed/b4rJHM27RPk?start=14&autoplay=1',
    platform: 'youtube',
    videoid: 'b4rJHM27RPk',
    startSeconds: 14,
    title: 'The best way to test a script is to run it when you cast a spell',
    note: `The best way to test a script is to run it when you cast a spell.
            This way you can test it without having to restart the game.`,
  }, {
    // href: '#import-skse64',
    // id: 'import-skse64',
    // src: 'https://www.youtube.com/embed/Hejm3TJw10E?start=1316&autoplay=1',
    platform: 'youtube',
    videoid: 'Hejm3TJw10E',
    startSeconds: 1316,
    title: 'How to import SKSE64 when writing a script',
    note: `SKSE64 is a library that extends the scripting capabilities of
            Skyrim. It is required for many of the more advanced features of
            Papyrus.`,
  }, {
    // href: '#install-debugger',
    // id: 'install-debugger',
    // src: 'https://www.youtube.com/embed/Hejm3TJw10E?start=1412&autoplay=1',
    platform: 'youtube',
    videoid: 'Hejm3TJw10E',
    startSeconds: 1412,
    title: 'How to install the Papyrus scripting debugger (SKSE64 needed!)',
    note: `The Papyrus scripting debugger is a tool that allows you to
            inspect the state of your script while it is running. It is
            extremely useful for debugging.`,
  }
]

export default BOOKMARK_LIST;