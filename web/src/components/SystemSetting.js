import React, { useEffect, useState } from 'react';
import { Divider, Form, Grid, Header, Message } from 'semantic-ui-react';
import { API, removeTrailingSlash, showError } from '../helpers';

const SystemSetting = () => {
  let [inputs, setInputs] = useState({
    PasswordLoginEnabled: '',
    PasswordRegisterEnabled: '',
    EmailVerificationEnabled: '',
    GitHubOAuthEnabled: '',
    GitHubClientId: '',
    GitHubClientSecret: '',
    Notice: '',
    SMTPServer: '',
    SMTPPort: '',
    SMTPAccount: '',
    SMTPToken: '',
    ServerAddress: '',
    Footer: '',
    WeChatAuthEnabled: '',
    WeChatServerAddress: '',
    WeChatServerToken: '',
    WeChatAccountQRCodeImageURL: '',
    TurnstileCheckEnabled: '',
    TurnstileSiteKey: '',
    TurnstileSecretKey: '',
    RegisterEnabled: '',
    openai_api_key: '',
    openai_default_model: '',
    openai_api_base: '',
  });
  const [originInputs, setOriginInputs] = useState({});
  let [loading, setLoading] = useState(false);

  const getOptions = async () => {
    const res = await API.get('/api/option/');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        newInputs[item.key] = item.value;
      });
      setInputs(newInputs);
      setOriginInputs(newInputs);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    getOptions().then();
  }, []);

  const updateOption = async (key, value) => {
    setLoading(true);
    switch (key) {
      case 'PasswordLoginEnabled':
      case 'PasswordRegisterEnabled':
      case 'EmailVerificationEnabled':
      case 'GitHubOAuthEnabled':
      case 'WeChatAuthEnabled':
      case 'TurnstileCheckEnabled':
      case 'RegisterEnabled':
        value = inputs[key] === 'true' ? 'false' : 'true';
        break;
      default:
        break;
    }
    const res = await API.put('/api/option/', {
      key,
      value,
    });
    const { success, message } = res.data;
    if (success) {
      setInputs((inputs) => ({ ...inputs, [key]: value }));
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const handleInputChange = async (e, { name, value }) => {
    if (
      name === 'Notice' ||
      name.startsWith('SMTP') ||
      name === 'ServerAddress' ||
      name === 'GitHubClientId' ||
      name === 'GitHubClientSecret' ||
      name === 'WeChatServerAddress' ||
      name === 'WeChatServerToken' ||
      name === 'WeChatAccountQRCodeImageURL' ||
      name === 'TurnstileSiteKey' ||
      name === 'TurnstileSecretKey' ||
      name === 'openai_api_key' ||
      name === 'openai_default_model' ||
      name === 'openai_api_base'
    ) {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      await updateOption(name, value);
    }
  };

  const submitServerAddress = async () => {
    let ServerAddress = removeTrailingSlash(inputs.ServerAddress);
    await updateOption('ServerAddress', ServerAddress);
  };

  const submitSMTP = async () => {
    if (originInputs['SMTPServer'] !== inputs.SMTPServer) {
      await updateOption('SMTPServer', inputs.SMTPServer);
    }
    if (originInputs['SMTPAccount'] !== inputs.SMTPAccount) {
      await updateOption('SMTPAccount', inputs.SMTPAccount);
    }
    if (
      originInputs['SMTPPort'] !== inputs.SMTPPort &&
      inputs.SMTPPort !== ''
    ) {
      await updateOption('SMTPPort', inputs.SMTPPort);
    }
    if (
      originInputs['SMTPToken'] !== inputs.SMTPToken &&
      inputs.SMTPToken !== ''
    ) {
      await updateOption('SMTPToken', inputs.SMTPToken);
    }
  };

  const submitWeChat = async () => {
    if (originInputs['WeChatServerAddress'] !== inputs.WeChatServerAddress) {
      await updateOption(
        'WeChatServerAddress',
        removeTrailingSlash(inputs.WeChatServerAddress)
      );
    }
    if (
      originInputs['WeChatAccountQRCodeImageURL'] !==
      inputs.WeChatAccountQRCodeImageURL
    ) {
      await updateOption(
        'WeChatAccountQRCodeImageURL',
        inputs.WeChatAccountQRCodeImageURL
      );
    }
    if (
      originInputs['WeChatServerToken'] !== inputs.WeChatServerToken &&
      inputs.WeChatServerToken !== ''
    ) {
      await updateOption('WeChatServerToken', inputs.WeChatServerToken);
    }
  };

  const submitGitHubOAuth = async () => {
    if (originInputs['GitHubClientId'] !== inputs.GitHubClientId) {
      await updateOption('GitHubClientId', inputs.GitHubClientId);
    }
    if (
      originInputs['GitHubClientSecret'] !== inputs.GitHubClientSecret &&
      inputs.GitHubClientSecret !== ''
    ) {
      await updateOption('GitHubClientSecret', inputs.GitHubClientSecret);
    }
  };

  const submitTurnstile = async () => {
    if (originInputs['TurnstileSiteKey'] !== inputs.TurnstileSiteKey) {
      await updateOption('TurnstileSiteKey', inputs.TurnstileSiteKey);
    }
    if (
      originInputs['TurnstileSecretKey'] !== inputs.TurnstileSecretKey &&
      inputs.TurnstileSecretKey !== ''
    ) {
      await updateOption('TurnstileSecretKey', inputs.TurnstileSecretKey);
    }
  };

  const submitOpenAI = async () => {
    if (originInputs['openai_api_key'] !== inputs.openai_api_key) {
      await updateOption('openai_api_key', inputs.openai_api_key);
    }
    if (originInputs['openai_default_model'] !== inputs.openai_default_model) {
      await updateOption('openai_default_model', inputs.openai_default_model);
    }
    if (originInputs['openai_api_base'] !== inputs.openai_api_base) {
      await updateOption('openai_api_base', inputs.openai_api_base);
    }
  };

  return (
    <Grid columns={1}>
      <Grid.Column>
        <Form loading={loading}>
          <Header as='h3'>通用设置</Header>
          <Form.Group widths='equal'>
            <Form.Input
              label='服务器地址'
              placeholder='例如：https://yourdomain.com'
              value={inputs.ServerAddress}
              name='ServerAddress'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Button onClick={submitServerAddress}>
            更新服务器地址
          </Form.Button>
          <Divider />
          <Header as='h3'>配置登录注册</Header>
          <Form.Group inline>
            <Form.Checkbox
              checked={inputs.PasswordLoginEnabled === 'true'}
              label='允许通过密码进行登录'
              name='PasswordLoginEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.PasswordRegisterEnabled === 'true'}
              label='允许通过密码进行注册'
              name='PasswordRegisterEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.EmailVerificationEnabled === 'true'}
              label='通过密码注册时需要进行邮箱验证'
              name='EmailVerificationEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.GitHubOAuthEnabled === 'true'}
              label='允许通过 GitHub 账户登录 & 注册'
              name='GitHubOAuthEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.WeChatAuthEnabled === 'true'}
              label='允许通过微信登录 & 注册'
              name='WeChatAuthEnabled'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Checkbox
              checked={inputs.RegisterEnabled === 'true'}
              label='允许新用户注册（此项为否时，新用户将无法以任何方式进行注册）'
              name='RegisterEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.TurnstileCheckEnabled === 'true'}
              label='启用 Turnstile 用户校验'
              name='TurnstileCheckEnabled'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Divider />
          <Header as='h3'>
            配置 SMTP
            <Header.Subheader>用以支持系统的邮件发送</Header.Subheader>
          </Header>
          <Form.Group widths={4}>
            <Form.Input
              label='SMTP 服务器地址'
              name='SMTPServer'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.SMTPServer}
              placeholder='例如：smtp.qq.com'
            />
            <Form.Input
              label='SMTP 端口'
              name='SMTPPort'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.SMTPPort}
              placeholder='默认: 587'
            />
            <Form.Input
              label='SMTP 账户'
              name='SMTPAccount'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.SMTPAccount}
              placeholder='通常是邮箱地址'
            />
            <Form.Input
              label='SMTP 访问凭证'
              name='SMTPToken'
              onChange={handleInputChange}
              type='password'
              autoComplete='new-password'
              value={inputs.SMTPToken}
              placeholder='敏感信息不会发送到前端显示'
            />
          </Form.Group>
          <Form.Button onClick={submitSMTP}>保存 SMTP 设置</Form.Button>
          <Divider />
          <Header as='h3'>
            配置 GitHub OAuth App
            <Header.Subheader>
              用以支持通过 GitHub 进行登录注册，
              <a href='https://github.com/settings/developers' target='_blank'>
                点击此处
              </a>
              管理你的 GitHub OAuth App
            </Header.Subheader>
          </Header>
          <Message>
            Homepage URL 填 <code>{inputs.ServerAddress}</code>
            ，Authorization callback URL 填{' '}
            <code>{`${inputs.ServerAddress}/oauth/github`}</code>
          </Message>
          <Form.Group widths={3}>
            <Form.Input
              label='GitHub Client ID'
              name='GitHubClientId'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.GitHubClientId}
              placeholder='输入你注册的 GitHub OAuth APP 的 ID'
            />
            <Form.Input
              label='GitHub Client Secret'
              name='GitHubClientSecret'
              onChange={handleInputChange}
              type='password'
              autoComplete='new-password'
              value={inputs.GitHubClientSecret}
              placeholder='敏感信息不会发送到前端显示'
            />
          </Form.Group>
          <Form.Button onClick={submitGitHubOAuth}>
            保存 GitHub OAuth 设置
          </Form.Button>
          <Divider />
          <Header as='h3'>
            配置 AI API
            <Header.Subheader>
              用以支持AI提示生成功能，
              <a
                href='https://dashscope.console.aliyun.com/apiKey'
                target='_blank'
                rel='noreferrer'
              >
                点击此处
              </a>
              获取阿里云通义千问API密钥
            </Header.Subheader>
          </Header>
          <Form.Group widths={3}>
            <Form.Input
              label='API 密钥'
              name='openai_api_key'
              onChange={handleInputChange}
              type='password'
              autoComplete='new-password'
              value={inputs.openai_api_key}
              placeholder='敏感信息不会发送到前端显示'
            />
            <Form.Input
              label='默认模型'
              name='openai_default_model'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.openai_default_model}
              placeholder='qwen-turbo'
            />
            <Form.Input
              label='API 基础URL'
              name='openai_api_base'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.openai_api_base}
              placeholder='例如：https://dashscope.aliyuncs.com'
            />
          </Form.Group>
          <Message>
            <Message.Header>关于通义千问 API</Message.Header>
            <Message.Content>
              <p>
                通义千问API密钥可以在
                <a
                  href='https://dashscope.console.aliyun.com/apiKey'
                  target='_blank'
                  rel='noreferrer'
                >
                  {' '}
                  阿里云灵积平台{' '}
                </a>
                获取。只有设置了有效的API密钥，AI提示功能才能正常使用。
              </p>
              <p>
                默认模型通常为 qwen-turbo，您也可以使用 qwen-plus、qwen-max 等其他模型。
              </p>
              <p>
                API基础URL默认为 https://dashscope.aliyuncs.com，如果您使用的是其他服务提供商，可以在此处修改。
              </p>
            </Message.Content>
          </Message>
          <Form.Button onClick={submitOpenAI}>
            保存 AI API 设置
          </Form.Button>
          <Divider />
          <Header as='h3'>
            配置 WeChat Server
            <Header.Subheader>
              用以支持通过微信进行登录注册，
              <a
                href='https://github.com/songquanpeng/wechat-server'
                target='_blank'
              >
                点击此处
              </a>
              了解 WeChat Server
            </Header.Subheader>
          </Header>
          <Form.Group widths={3}>
            <Form.Input
              label='WeChat Server 服务器地址'
              name='WeChatServerAddress'
              placeholder='例如：https://yourdomain.com'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.WeChatServerAddress}
            />
            <Form.Input
              label='WeChat Server 访问凭证'
              name='WeChatServerToken'
              type='password'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.WeChatServerToken}
              placeholder='敏感信息不会发送到前端显示'
            />
            <Form.Input
              label='微信公众号二维码图片链接'
              name='WeChatAccountQRCodeImageURL'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.WeChatAccountQRCodeImageURL}
              placeholder='输入一个图片链接'
            />
          </Form.Group>
          <Form.Button onClick={submitWeChat}>
            保存 WeChat Server 设置
          </Form.Button>
          <Divider />
          <Header as='h3'>
            配置 Turnstile
            <Header.Subheader>
              用以支持用户校验，
              <a href='https://dash.cloudflare.com/' target='_blank'>
                点击此处
              </a>
              管理你的 Turnstile Sites，推荐选择 Invisible Widget Type
            </Header.Subheader>
          </Header>
          <Form.Group widths={3}>
            <Form.Input
              label='Turnstile Site Key'
              name='TurnstileSiteKey'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.TurnstileSiteKey}
              placeholder='输入你注册的 Turnstile Site Key'
            />
            <Form.Input
              label='Turnstile Secret Key'
              name='TurnstileSecretKey'
              onChange={handleInputChange}
              type='password'
              autoComplete='new-password'
              value={inputs.TurnstileSecretKey}
              placeholder='敏感信息不会发送到前端显示'
            />
          </Form.Group>
          <Form.Button onClick={submitTurnstile}>
            保存 Turnstile 设置
          </Form.Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default SystemSetting;
