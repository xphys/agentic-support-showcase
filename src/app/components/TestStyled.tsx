'use client';

export default function TestStyled() {
  return (
    <div className="test-container">
      <h1>Styled JSX Test</h1>
      <p>If this has a red background, styled-jsx is working!</p>

      <style jsx>{`
        .test-container {
          padding: 40px;
          background: linear-gradient(135deg, #ff0000 0%, #ff00ff 100%);
          border-radius: 20px;
          color: white;
        }

        h1 {
          font-size: 2rem;
          font-weight: 800;
        }

        p {
          font-size: 1.2rem;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
