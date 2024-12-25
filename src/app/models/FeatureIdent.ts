export enum FeatureIdent {
  DEV_MODE = 'DEV_MODE',
  BOOKMARKS = 'BOOKMARKS',
  STATS = 'STATS',
  SAVE_TAB_AS_PDF = 'SAVE_TAB_AS_PDF', // not active yet
  SAVE_TAB_AS_PNG = 'SAVE_TAB_AS_PNG',
  GROUP_BY_DOMAIN = 'GROUP_BY_DOMAIN',
  OPENTABS_THRESHOLD = 'OPENTABS_THRESHOLD',
  RSS = 'RSS',
  SESSIONS = 'SESSIONS',
  SPACES = 'SPACES',
  HELP = 'HELP',
  TOP10 = 'TOP10',
  OPEN_TABS = 'OPEN_TABS',
  WINDOWS = 'WINDOWS',
  SCHEDULED = 'SCHEDULED',
  BACKUP = 'BACKUP',
  IGNORE = 'IGNORE',
  NOTES = 'NOTES',
  TAGS = 'TAGS',
  SIDE_PANEL = 'SIDE_PANEL',
  WEBSITE_CLIP = 'WEBSITE_CLIP',
  STANDALONE_APP = 'STANDALONE_APP',
  //AI_MODULE = "AI_MODULE",
  //CATEGORIZATION = "CATEGORIZATION",
  NOTIFICATIONS = 'NOTIFICATIONS',
  ANNOTATIONS = 'ANNOTATIONS',
  ARCHIVE_TABSET = 'ARCHIVE_TABSET',
  COLOR_TAGS = 'COLOR_TAGS',
  ADVANCED_TAB_MANAGEMENT = 'ADVANCED_TAB_MANAGEMENT',
  ANALYSE_TABS = 'ANALYSE_TABS',
  TAB_GROUPS = 'TAB_GROUPS',
  MONITORING = 'MONITORING',
  TAB_HELPER = 'TAB_HELPER',
  AUTO_TAB_SWITCHER = 'AUTO_TAB_SWITCHER',
  TABS_AS_TREE = 'TABS_AS_TREE',
  TABSET_SUBFOLDER = 'TABSET_SUBFOLDER',
  TABSETS_SHARING = 'TABSETS_SHARING',
  // TABSET_SUBFOLDER = "TABSET_SUBFOLDER", -- default now
  WINDOWS_MANAGEMENT = 'WINDOWS_MANAGEMENT',
  NEWEST_TABS = 'NEWEST_TABS',
  RESEARCH_SESSIONS = 'RESEARCH_SESSIONS',
  DYNAMIC_TABSET = 'DYNAMIC_TABSET',
  GALLERY = 'GALLERY',
  READING_MODE = 'READING_MODE',
  HTML_SNIPPETS = 'HTML_SNIPPETS',
  TABSET_LIST = 'TABSET_LIST',
}

export enum FeatureType {
  RECOMMENDED = 'RECOMMENDED',
  OPTIONAL = 'OPTIONAL',
  EXPERIMENTAL = 'EXPERIMENTAL',
  PLANNED = 'PLANNED',
  DISABLED = 'DISABLED',
  INTERNAL = 'INTERNAL',
}
