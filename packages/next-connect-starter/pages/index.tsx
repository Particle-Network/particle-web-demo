import styles from '../styles/Home.module.css';
import { ConnectButton } from '@particle-network/connect-react-ui';

export default function Home() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    <a href="https://docs.particle.network/connect-service/sdks/web">Particle Connect Docs</a>
                </h1>
                <div style={{ marginTop: 100 }}>
                    <ConnectButton />
                </div>
            </main>
        </div>
    );
}
