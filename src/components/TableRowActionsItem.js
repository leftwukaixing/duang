def((ListItem, Confirm) => class extends ListItem {
  init() {
    this.text = this.title || this.method;
  }
  onClick() {
    this.confirm ? Confirm.popup(this.confirm).then(result => result && this.exec()) : this.exec();
  }
  get exec() { return this[this.method + 'Action'] || this.defaultAction; }
  goAction() {
    let { module, key, params, _blank, target, title, where } = this;
    params = JSON.stringify(refactor(params || {}, this.fieldMap));
    where = JSON.stringify(refactor(where || {}, this.fieldMap));
    let uParams = new UParams({ module, key, params, where });
    if (_blank) target = '_blank';
    switch (target) {
      case '_blank':
        return open(location.href.replace(/(#.*)?$/, '#' + uParams));
      case 'dialog':
        return require([ 'modules/' + (module || 'default') + '.js' ], Module => {
          let { Main } = Module.prototype;
          dialog.popup(new Main({ depot: depot.fork(uParams), title }));
        });
      default:
        return location.hash = '#' + uParams;
    }
  }
  editAction() {
    this.module = 'editor';
    this.params = Object.assign({ '@id': '$.id' }, depot.params);
    this.key = depot.key;
    this.goAction();
  }
  defaultAction() {
    let path = [ depot.resolvedKey, this.fieldMap.id ];
    if ('api' in this) path.push(this.api);
    api(path, { method: this.method || 'POST' }).then(result => {
      depot.refresh();
    }, error => {
      alert(error.message);
    });
  }
  get styleSheet() {
    return `
      :scope {
        margin-left: .5em;
        display: inline-block;
        &:hover {
          text-shadow: 0px 0px 2px #999;
          color: #000;
        }
      }
    `;
  }
});
