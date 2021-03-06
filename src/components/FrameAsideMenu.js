def((FrameAsideMenuItem) => class extends Jinkela {
  init() {
    let { key, session } = depot;
    let { schemes } = config;
    let { permissions = [] } = session;
    schemes = schemes.filter(scheme => {
      if (/(?:^|\/):/.test(scheme.key)) return false;
      if (scheme.hidden) return false;
      if (!scheme.require) return true;
      return scheme.require.some((dep => ~permissions.indexOf(dep)));
    });
    FrameAsideMenuItem.cast(schemes, { currentKey: key }).renderTo(this);
  }
  get template() { return `<ul></ul>`; }
  get styleSheet() {
    return `
      :scope {
        list-style: none;
        padding: 0;
      }
    `;
  }
});
