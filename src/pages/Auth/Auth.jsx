import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Tabs, 
  Card, 
  Divider, 
  Checkbox, 
  notification,
  Typography
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  GoogleOutlined,
  FacebookOutlined,
  GithubOutlined
} from '@ant-design/icons';
import 'tailwindcss/tailwind.css';

const { Title } = Typography;
const { TabPane } = Tabs;

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  
  // Form handlers
  const onLoginFinish = (values) => {
    setLoading(true);
    console.log('Login form values:', values);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'Login Successful',
        description: `Welcome back, ${values.username}!`,
      });
    }, 1500);
  };
  
  const onRegisterFinish = (values) => {
    setLoading(true);
    console.log('Register form values:', values);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'Registration Successful',
        description: `Account created for ${values.email}`,
      });
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center my-7">
      <Card className="w-96 shadow-md rounded-lg">
        <Title level={2} className="text-center mb-8">
          Welcome
        </Title>
        
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Login" key="1">
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onLoginFinish}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Username or Email" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              
              <Form.Item>
                <div className="flex justify-between">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a href="#forgot-password">Forgot password?</a>
                </div>
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="w-full" 
                  size="large"
                  loading={loading}
                >
                  Log in
                </Button>
              </Form.Item>
              
              <Divider plain>or login with</Divider>
              
              <div className="flex justify-center gap-4 mb-4">
                <Button icon={<GoogleOutlined />} shape="circle" size="large" />
                <Button icon={<FacebookOutlined />} shape="circle" size="large" />
                <Button icon={<GithubOutlined />} shape="circle" size="large" />
              </div>
            </Form>
          </TabPane>
          
          <TabPane tab="Register" key="2">
            <Form
              name="register"
              onFinish={onRegisterFinish}
              layout="vertical"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Email" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Please input your username!' },
                  { min: 4, message: 'Username must be at least 4 characters' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Username" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              
              <Form.Item
                name="confirm"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
                  size="large"
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  { 
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions')),
                  },
                ]}
              >
                <Checkbox>
                  I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                </Checkbox>
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="w-full" 
                  size="large"
                  loading={loading}
                >
                  Register
                </Button>
              </Form.Item>
              
              <Divider plain>or register with</Divider>
              
              <div className="flex justify-center gap-4">
                <Button icon={<GoogleOutlined />} shape="circle" size="large" />
                <Button icon={<FacebookOutlined />} shape="circle" size="large" />
                <Button icon={<GithubOutlined />} shape="circle" size="large" />
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;