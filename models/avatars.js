var fs_store, ref, ref1;

if (((ref = Meteor.settings["public"].cfs) != null ? ref.store : void 0) === "OSS") {
  if (Meteor.isClient) {
    fs_store = new FS.Store.OSS('wekan_avatars');
  } else if (Meteor.isServer) {
    fs_store = new FS.Store.OSS('wekan_avatars', {
      region: Meteor.settings.cfs.aliyun.region,
      aliyunInternal: Meteor.settings.cfs.aliyun.aliyunInternal,
      bucket: Meteor.settings.cfs.aliyun.bucket,
      folder: Meteor.settings.cfs.aliyun.folder,
      accessKeyId: Meteor.settings.cfs.aliyun.accessKeyId,
      secretAccessKey: Meteor.settings.cfs.aliyun.secretAccessKey
    });
  }
} else if (((ref1 = Meteor.settings["public"].cfs) != null ? ref1.store : void 0) === "S3") {
  if (Meteor.isClient) {
    fs_store = new FS.Store.S3("wekan_avatars");
  } else if (Meteor.isServer) {
    fs_store = new FS.Store.S3("wekan_avatars", {
      region: Meteor.settings.cfs.aws.region,
      bucket: Meteor.settings.cfs.aws.bucket,
      folder: Meteor.settings.cfs.aws.folder,
      accessKeyId: Meteor.settings.cfs.aws.accessKeyId,
      secretAccessKey: Meteor.settings.cfs.aws.secretAccessKey
    });
  }
} else {
  fs_store = new FS.Store.FileSystem("wekan_avatars");
}

Avatars = new FS.Collection('wekan_avatars', {
  stores: [
    fs_store
  ],
  filter: {
    maxSize: 72000,
    allow: {
      contentTypes: ['image/*'],
    },
  },
});

function isOwner(userId, file) {
  return userId && userId === file.userId;
}

Avatars.allow({
  insert: isOwner,
  update: isOwner,
  remove: isOwner,
  download() {
    return true;
  },
  fetch: ['userId'],
});

Avatars.files.before.insert((userId, doc) => {
  doc.userId = userId;
});