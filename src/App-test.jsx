function App() {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
                Tamil Aathichudi
            </h1>
            <h2 style={{ fontSize: '32px', marginBottom: '40px', color: '#ffeb3b' }}>
                Draw & Learn
            </h2>
            <div style={{ fontSize: '64px', marginBottom: '40px' }}>
                அ ஆ இ ஈ உ
            </div>
            <button 
                onClick={() => alert('Button works! The issue is with Phaser game loading.')}
                style={{
                    padding: '15px 30px',
                    fontSize: '20px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                Test Button
            </button>
            <p style={{ marginTop: '20px', fontSize: '16px' }}>
                If you see this page, React is working fine.
                The issue is with the Phaser game initialization.
            </p>
        </div>
    );
}

export default App;