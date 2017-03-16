// We save the user language preference in the user profile, and use that to set
// the language reactively. If the user is not connected we use the language
// information provided by the browser, and default to english.

$.ajax({
  type: 'GET',
  url: Meteor.absoluteUrl("tap-i18n/multi/en,zh-CN.json"),
  dataType: 'json',
  success: function(data) {
    for (lang_tag in data) {
      TAPi18n._loadLangFileObject(lang_tag, data[lang_tag]);
      TAPi18n._loaded_languages.push(lang_tag);
    }
  },
  data: {},
  async: false
});

Meteor.startup(() => {
  Tracker.autorun(() => {
    const currentUser = Meteor.user();
    let language;
    if (currentUser && currentUser.profile && currentUser.profile.language) {
      language = currentUser.profile.language;
    } else {
      language = navigator.language || navigator.userLanguage;
    }

    if (language) {
      TAPi18n.setLanguage(language);
      T9n.setLanguage(language);
    }
  });
});