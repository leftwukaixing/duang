def((ListItem) => class extends ListItem {
  init() {
    if (this.currentKey === this.key) this.element.classList.add('active');
    this.text = this.title || this.key.replace(/([^/]{2})[^/]{3,}\//g, '$1../');
  }
  onClick() {
    let { module = 'list', key, where = {}, params = {} } = this;
    let tasks = [];
    if (this['@where']) tasks.push(api([ this.key, this['@where'] ]).then(result => where = result));
    if (this['@params']) tasks.push(api([ this.key, this['@params'] ]).then(result => params = result));
    const done = () => {
      where = JSON.stringify(where);
      params = JSON.stringify(params);
      location.hash = '#' + new UParams({ module, key, where, params });
    };
    tasks.length ? Promise.all(tasks).then(done) : done();
  }
  get styleSheet() {
    return `
      :scope {
        line-height: 2;
        list-style: disc inside;
        white-space: nowrap;
        > a {
          text-overflow: ellipsis;
          overflow: hidden;
        }
        padding: 0 1em;
        transition: background 200ms ease;
        &.active {
          background: #ccc;
        }
        &:hover {
          background: #d4d4d4;
        }
      }
    `;
  }
});
