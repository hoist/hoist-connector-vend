/* globals UI */

var C = UI.Views.Connector;

class EditForm extends C.View {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
    if (!props.connector) {
      this.state.mode = 'connect';
    }
  }
  render() {
    return (
      <C.Page default="setup" {...this.props}>
        <C.Panel name="Setup" slug="setup">
          <C.Column type="notes">
            <h1>Adding a Vend Connector</h1>
            <ol>
              <li>Log in to <a href="https://developers.vendhq.com/">https://developers.vendhq.com/</a></li>
              <li>Click the <strong>'Applications'</strong> tab</li>
              <li>Click <strong>'Add new application'</strong></li>
              <li>Enter your application name and set the Redirect URI to <strong>'https://bouncer.hoist.io/bounce'</strong></li>
              <li>Click <strong>'Add Application'</strong></li>
              <li>When it successfully saves the application, it will return a page with 'My Applications'. Copy both <strong>'Client Id'</strong> and <strong>'Client Secret'</strong> for your new application into the boxes on this page.</li>
              <li>Click <strong>'Save and Verify'</strong></li>
            </ol>
          </C.Column>
          <C.Column>
            <form onChange={(evt) => {
              this.props.updateField(evt);
            }} onSubmit={(evt) => {
              this.props.updateSettings(evt);
            }}>
              <UI.FormElements.Input inactive={!!(this.props.connectorInstance)} placeholder="Key" name="key" label="Key" type="text" value={this.props._key}/>
              <UI.FormElements.Input placeholder="Client Id" name="clientId" label="Client Id" type="text" value={this.props.settings.clientId}/>
              <UI.FormElements.Input placeholder="Client Secret" name="clientSecret" label="Client Secret" type="text" value={this.props.settings.clientSecret}/>
              <UI.FormElements.Button
                loading={this.props.saving}
                text={this.props.connectorInstance ? 'Save' : 'Create'}
                type="large"
                submit={true}
                onClick={this.props.updateSettings} />
            </form>
          </C.Column>
        </C.Panel>
      </C.Page>
    );
  }
}

export default EditForm;
global.EditForm = EditForm;
