var fs_store, ref, ref1;

if (((ref = Meteor.settings["public"].cfs) != null ? ref.store : void 0) === "OSS") {
  if (Meteor.isClient) {
    fs_store = new FS.Store.OSS('wekan_attachments');
  } else if (Meteor.isServer) {
    fs_store = new FS.Store.OSS('wekan_attachments', {
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
    fs_store = new FS.Store.S3("wekan_attachments");
  } else if (Meteor.isServer) {
    fs_store = new FS.Store.S3("wekan_attachments", {
      region: Meteor.settings.cfs.aws.region,
      bucket: Meteor.settings.cfs.aws.bucket,
      folder: Meteor.settings.cfs.aws.folder,
      accessKeyId: Meteor.settings.cfs.aws.accessKeyId,
      secretAccessKey: Meteor.settings.cfs.aws.secretAccessKey
    });
  }
} else {
  fs_store = new FS.Store.FileSystem("wekan_attachments");
}

Attachments = new FS.Collection('wekan_attachments', {
  stores: [fs_store]
});

if (Meteor.isServer) {
  Attachments.allow({
    insert(userId, doc) {
      return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    update(userId, doc) {
      return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    remove(userId, doc) {
      return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    // We authorize the attachment download either:
    // - if the board is public, everyone (even unconnected) can download it
    // - if the board is private, only board members can download it
    //
    // XXX We have a bug with the `userId` verification:
    //
    //   https://github.com/CollectionFS/Meteor-CollectionFS/issues/449
    //
    download(userId, doc) {
      const query = {
        $or: [{
          'members.userId': userId
        }, {
          permission: 'public'
        }, ],
      };
      return Boolean(Boards.findOne(doc.boardId, query));
    },

    fetch: ['boardId'],
  });
}

// XXX Enforce a schema for the Attachments CollectionFS

Attachments.files.before.insert((userId, doc) => {
  const file = new FS.File(doc);
  doc.userId = userId;

  // If the uploaded document is not an image we need to enforce browser
  // download instead of execution. This is particularly important for HTML
  // files that the browser will just execute if we don't serve them with the
  // appropriate `application/octet-stream` MIME header which can lead to user
  // data leaks. I imagine other formats (like PDF) can also be attack vectors.
  // See https://github.com/wekan/wekan/issues/99
  // XXX Should we use `beforeWrite` option of CollectionFS instead of
  // collection-hooks?
  if (!file.isImage()) {
    file.original.type = 'application/octet-stream';
  }
});

if (Meteor.isServer) {
  Attachments.files.after.insert((userId, doc) => {
    Activities.insert({
      userId,
      type: 'card',
      activityType: 'addAttachment',
      attachmentId: doc._id,
      boardId: doc.boardId,
      cardId: doc.cardId,
    });
  });

  Attachments.files.after.remove((userId, doc) => {
    Activities.remove({
      attachmentId: doc._id,
    });
  });
}