import _ from "lodash"
//import {GrantPermissionCommand} from "src/domain/commands/GrantPermissionCommand";
//import {RevokePermissionCommand} from "src/domain/commands/RevokePermissionCommand";
import {Feature} from "src/features/models/Feature";
import {FeatureIdent, FeatureType} from "src/models/FeatureIdent";

export class AppFeatures {
  features: Feature[] = [

    new Feature(FeatureIdent.DEV_MODE, FeatureType.INTERNAL, "Developer Mode",
      "A feature toggle to switch between dev mode on/off", "","",['all']),

    new Feature(FeatureIdent.TOP10, FeatureType.RECOMMENDED,
      'Top 10 Tabs',
      'Activate a view to list all tabs by how often they have been accessed',
      'o_workspace_premium', 'top10.png', ['all']),

    new Feature(FeatureIdent.OPEN_TABS, FeatureType.RECOMMENDED,
      'Open Tabs',
      'Quick access to all your open tabs of the current browsers window<br><br>' +
      'Adds quick navigation to jump back and forth to recently opened tabs.',
      'o_playlist_add', '', ['bex']),

    new Feature(FeatureIdent.SAVE_TAB_AS_PNG, FeatureType.EXPERIMENTAL,
      'Save Tab as Image', 'You can save tabs as a PNG Image.<br>Creating an image will utilize an external server.',
      'o_image', '', ['bex'], [], true),
   //   .setActivateCommands([new GrantPermissionCommand('pageCapture')]),

    new Feature(FeatureIdent.GROUP_BY_DOMAIN, FeatureType.OPTIONAL,
      'Group By Domain View',
      'The "Grouped By Domain" Feature provides a view where you can see all your tabs grouped by Domains. All Domains with at least two matching tabs will be considered.',
      'o_dns', 'groupedByDomain.png', ['all']),

    new Feature(FeatureIdent.OPENTABS_THRESHOLD, FeatureType.OPTIONAL,
      'Open Tabs Warnings',
      'The Idea behind the tabset extension is to keep your tabs count small - and still deal with all the URLs you need to handle. Tabsets' +
      ' can help you by tracking your open tabs count and alert you when it gets too big. Furthermore, it offers you ways to reduce your tab count on the fly. This ' +
      'feature is customizable in the settings.',
      'o_tab', 'open_tabs_warning.png', ['bex']),

    new Feature(FeatureIdent.EXPERIMENTAL_VIEWS, FeatureType.EXPERIMENTAL,
      'Experimental Views',
      'The default view of your tabset is a list - but there can be other views as well like grids or even a canvas.',
      'o_explore', '', ['all']),

    new Feature(FeatureIdent.RSS, FeatureType.EXPERIMENTAL,
      'RSS View',
      'The "RSS View" list all your RSS Pages. It is recommended to enable the "analyse Tabs" feature as well to automatically find linked rss feeds from your tabsets.',
      'o_rss_feed', 'rss.png', ['bex', 'spa']),

    new Feature(FeatureIdent.SESSIONS, FeatureType.DISABLED,
      'Sessions',
      'A session is a special type of tabsets where your newly opened tabs will be tracked automatically',
      'o_explore', '', ['all']),

    new Feature(FeatureIdent.SPACES, FeatureType.OPTIONAL,
      'Spaces',
      'The "Spaces" Feature lets you organize your tabsets in a larger structure, which might become handy ' +
      'if you start having many tabsets. The main difference to bookmark folders is that there is only two ' +
      'levels, but you can assign a tabset to multiple spaces.',
      'o_space_dashboard', '',['all']),

    new Feature(FeatureIdent.BACKUP, FeatureType.EXPERIMENTAL,
      'Backup Tabset',
      'Simply get rid of all open tabs by assigning them to this special tabset - a backup tabset which you can revisit later for proper assignment',
      'o_inventory_2', '', ['bex']),

    new Feature(FeatureIdent.IGNORE, FeatureType.EXPERIMENTAL,
      'Ignore Tabset',
      'This is a list of urls you want to ignore. This can be normal urls or urls with placeholders to catch all google search results for example',
      'o_pause_circle', '', ['bex']),

    new Feature(FeatureIdent.TAGS, FeatureType.RECOMMENDED,
      'Use Tags for Tabs',
      'Tabs can be tagged with labels making it easier to be found again',
      'o_label', '', ['all']),

    new Feature(FeatureIdent.NOTES, FeatureType.EXPERIMENTAL,
      'Notes Feature',
      'CreateCreate notes and treat them like tabs',
      'o_note', '', ['all']),

    // permissions notification
    new Feature(FeatureIdent.WEBSITE_CLIP, FeatureType.EXPERIMENTAL,
      'Create an image clip from a website and store it',
      '',
      'filter_center_focus', '', ['bex']),
      // .setActivateCommands([new GrantPermissionCommand('notifications')]),

    new Feature(FeatureIdent.STANDALONE_APP, FeatureType.RECOMMENDED,
      'Standalone App',
      'Tabsets as full-page application',
       'o_open_in_new','', ['bex']),

    new Feature(FeatureIdent.NOTIFICATIONS, FeatureType.RECOMMENDED,
      'Browser Notifications',
      'Allow Tabsets to send Notifications via your Browser. Recommended.',
      'o_notifications', '', ['all']),
      // .setActivateCommands([new GrantPermissionCommand('notifications')])
      // .setDeactivateCommands([new RevokePermissionCommand('notifications')]),

    new Feature(FeatureIdent.ANNOTATIONS, FeatureType.EXPERIMENTAL,
      'Annotate Websites',
      'Hightlight text on a website and create and comment on annotations.',
      'o_auto_awesome', '', ['bex']),

    new Feature(FeatureIdent.ARCHIVE_TABSET, FeatureType.OPTIONAL,
      'Archive Tabsets',
      'Push Tabsets you don\'t need into an archive and restore them later if you want',
      'o_inventory_2', '', ['all']),

    new Feature(FeatureIdent.COLOR_TAGS, FeatureType.OPTIONAL, 'Color Tags',
      'Assign colors to Tabsets and Tabs as an additional organization level',
      'o_colorize', '', ['all']),

    new Feature(FeatureIdent.ADVANCED_TAB_MANAGEMENT, FeatureType.EXPERIMENTAL,
      'Advanced Tab Management',
      'Sometimes you want pages to open in the same tab, even if the URLs are (slightly) different',
      'o_tab', '', ['all']),

    // permission allOrigins?
    new Feature(FeatureIdent.ANALYSE_TABS, FeatureType.EXPERIMENTAL,
      'Analyse Tabs',
      'This extension can analyse the tabs you visit, so that the search can be improved significantly. The tab\'s content, ' +
      'its links and the received http headers are taken into account. ' +
      'Please note that only tabs that you visit (or revisit) after the activation of this feature are going to be analysed.',
      'o_tab', 'analyse.png', ['bex'])
      // .setActivateCommands([new GrantPermissionCommand('webRequest')])
      .setImageWidth("700px"),

    new Feature(FeatureIdent.TAB_GROUPS, FeatureType.EXPERIMENTAL,
      'Chrome Tab Groups',
      'Utilize Chrome Tab Groups',
      'o_view_list', '', ['chrome_bex']),
      // .setActivateCommands([new GrantPermissionCommand('tabGroups')]),

    new Feature(FeatureIdent.MONITORING, FeatureType.EXPERIMENTAL,
      'Monitor Website Changes',
      'Check periodically for changes of a website<br><br>' +
      'This feature is not reliable, as there are many reasons why a website might change (e.g. if it simply displays a date).' +
      'But sometimes it can be helpful. Use at your own discretion.',
      'o_change_circle', 'monitor.png', ['bex']),

    new Feature(FeatureIdent.TAB_HELPER, FeatureType.EXPERIMENTAL,
      'Tab Helper',
      'Add a small tag on any website to access tabsets features quickly.<br>' +
      'You need to restart tabsets if you activate or deactivate this feature.<br>' +
      'The Tabsets Helper Icon will appear on all pages you open once activated.',
      'o_article', 'tabhelper.png', ['bex']),

    new Feature(FeatureIdent.AUTO_TAB_SWITCHER, FeatureType.EXPERIMENTAL,
      'Auto Tab Switcher',
      'Switch the Tab\'s URL every x Seconds',
      'o_switch_left', '', ['bex']),

    new Feature(FeatureIdent.TABSET_SUBFOLDER, FeatureType.OPTIONAL,
      'Subfolder for Tabsets',
      'Use Subfolders in Tabsets. Currently the only way to create subfolders is by importing recursive levels of bookmarks.',
      'o_folder', '', ['all']),

    new Feature(FeatureIdent.TABSETS_SHARING, FeatureType.OPTIONAL,
      'Sharing Tabsets',
      'Share tabsets publicly.',
      'o_ios_share', '', ['all'], [], true),
  ]

  getFeature(f: FeatureIdent): Feature | undefined {
    const found = _.filter(this.features, (feature: Feature) => feature.ident === f)
    if (found && found.length > 0) {
      return found[0]
    }
    return undefined
  }

  getFeatures(): Feature[] {
    return this.features
  }
}
