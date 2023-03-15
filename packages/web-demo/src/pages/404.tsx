import { Button, Result } from 'antd';
import './index.scss';
function Page404() {
    return (
        <div className="center-box">
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Button
                        type="primary"
                        onClick={() => {
                            window.location.href = '/';
                        }}
                    >
                        Back Home
                    </Button>
                }
            />
        </div>
    );
}

export default Page404;
