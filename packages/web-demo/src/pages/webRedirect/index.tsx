import { ParticleNetwork, UserInfo } from '@particle-network/auth';
import { Button, Card, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './index.scss';

const PageWebRedirect = () => {
    const [form] = useForm();

    const [loading, setloading] = useState(false);

    const [searchParams] = useSearchParams();

    const particle = useMemo(() => {
        // TODO: particle config must same as native app
        const projectId = searchParams.get('projectId');
        const clientKey = searchParams.get('clientKey');
        const appId = searchParams.get('appId');
        const particle = new ParticleNetwork({
            projectId: projectId || (process.env.REACT_APP_PROJECT_ID as string),
            clientKey: clientKey || (process.env.REACT_APP_CLIENT_KEY as string),
            appId: appId || (process.env.REACT_APP_APP_ID as string),
            chainName: 'Ethereum',
            chainId: 1,
            wallet: {
                displayWalletEntry: false,
            },
        });
        return particle;
    }, []);

    const routerToApp = (userInfo: UserInfo) => {
        console.log('start router to app');
        setTimeout(() => {
            //TODO: Strongly recommend：Encrypted the info
            window.location.href = `happywallet://callback/?userInfo=${encodeURIComponent(JSON.stringify(userInfo))}`;
        }, 300);
    };

    const connect = async () => {
        setloading(true);
        try {
            const jwt = form.getFieldValue('jwt');
            const userInfo = await particle.auth.login(
                jwt
                    ? {
                          preferredAuthType: 'jwt',
                          account: jwt,
                          hideLoading: true,
                      }
                    : undefined
            );
            routerToApp(userInfo);
        } catch (error) {
            console.log('connect particle', error);
        } finally {
            setloading(false);
        }
    };
    return (
        <div className="redirect-box">
            <Card title="Particle Auth" className="input-card">
                <Form form={form}>
                    <Form.Item name="jwt">
                        <Input placeholder="JWT (optional)"></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            className="btn-connect"
                            type="primary"
                            htmlType="submit"
                            onClick={connect}
                            loading={loading}
                        >
                            Connect
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default PageWebRedirect;
