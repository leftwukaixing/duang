def((Button) => {

  class SpanButton extends Button {
    get tag() { return 'span'; }
  }

  class CancelButton extends Jinkela {
    init() {
      this.element.addEventListener('click', this.onClick);
    }
    get template() { return '<a href="JavaScript:">&#x274C;</a>'; }
    get styleSheet() {
      return `
        :scope {
          display: none;
          vertical-align: middle;
          margin-left: 1em;
        }
      `;
    }
  }

  class Preview extends Jinkela {
    get template() { return `<a target="_blank" href="JavaScript:"><img/></a>`; }
    set token(token) {
      if (token) {
        api([ this.api, token ]).then(result => {
          let url = URL.createObjectURL(result);
          this.element.style.display = 'inline-block';
          this.element.href = url;
          this.element.firstChild.src = url;
        });
      } else {
        // this.element.style.display = 'none';
      }
    }
    get styleSheet() {
      return `
        :scope {
          display: inline-block;
          width: 50px;
          height: 50px;
          margin-left: .5em;
          vertical-align: middle;
          text-align: center;
          &::after {
            content: '';
            display: inline-block;
            height: 100%;
            width: 0px;
            vertical-align: middle;
          }
          img {
            display: none;
            max-width: ${this.maxWidth || '50px'};
            max-height: ${this.maxHeight || '50px'};
            display: inline-block;
            vertical-align: middle;
            border-radius: 100%;
          }
        }
      `;
    }
  }

  return class extends Jinkela {
    get value() { return this.$value; }
    set value(value) {
      this.$value = value;
      this.preview.token = value;
    }
    get template() {
      return `
        <div><label ref="label"><input ref="input" type="file" /></label></div>
      `;
    }
    init() {
      if (!this.text) this.text = 'Select File';
      this.input.addEventListener('change', event => this.change(event));
      this.button = new SpanButton({ text: this.text }).renderTo(this.label);
      this.preview = new Preview(this).renderTo(this);
      this.cancelButton = new CancelButton({ onClick: () => this.value = null }).renderTo(this);
    }
    change(event) {
      let { target } = event;
      let file = target.files[0];
      if (!file) return;
      this.button.element.classList.add('busy');
      api(this.api, { method: 'POST', body: file }).then(result => {
        this.button.element.classList.remove('busy');
        this.value = result;
      });
    }
    get styleSheet() {
      return `
        :scope {
          label {}
          label[notEmpty=true] ~ * { display: inline-block; }
          input { display: none; }
        }
      `;
    }
  }

});
