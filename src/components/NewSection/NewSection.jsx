import React from 'react';
import threedImage from '../../assets/threed.png';

export default function NewSection() {
  console.log('NewSection rendering standalone version');
  
  return (
    <section style={{
      width: '100%',
      backgroundColor: '#000000',
      padding: '4rem 0',
      minHeight: '300px',
      position: 'relative',
      zIndex: 9999
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3rem'
        }}>
          {/* Left Column - GIF/Video */}
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              width: '350px',
              height: '350px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={threedImage}
                alt="3D trading visualization"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              />
            </div>
          </div>

          {/* Right Column - Text */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              textAlign: 'left'
            }}>
              <h2 style={{
                fontSize: '4rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                lineHeight: 1.1,
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
              }}>
                MONEY TALKS
              </h2>
              <h2 style={{
                fontSize: '4rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                lineHeight: 1.1,
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
              }}>
                WE TRANSLATE
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
