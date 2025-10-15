import React, { useState } from 'react';
import axios from 'axios';

export default function UploadComponent() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
      setStatus('idle');
    }
  };

  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setMessage('');
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      setStatus('error');
      return;
    }
    
    const formData = new FormData();
    formData.append('codeFile', file);
    setMessage("Uploading your file...");
    setStatus('uploading');
    
    try {
      console.log(process.env.REACT_APP_BACKEND_URL);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/review/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage("Upload successful! Refresh your dashboard to see the file.");
      setStatus('success');
      setTimeout(() => {
        setFile(null);
        setMessage('');
        setStatus('idle');
      }, 3000);
    } catch (err) {
      setMessage(
        "Upload failed: " +
        (err.response?.data?.error || err.response?.data || err.message)
      );
      setStatus('error');
    }
  };

  const removeFile = () => {
    setFile(null);
    setMessage('');
    setStatus('idle');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '40px',
        animation: 'fadeIn 0.5s ease-in'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
          }}>
            <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a202c',
            margin: '0 0 10px 0'
          }}>Upload Code File</h2>
          <p style={{
            fontSize: '16px',
            color: '#718096',
            margin: 0
          }}>Share your code for review and analysis</p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            position: 'relative',
            border: `3px dashed ${isDragging ? '#667eea' : file ? '#48bb78' : '#cbd5e0'}`,
            borderRadius: '16px',
            padding: '50px 20px',
            textAlign: 'center',
            background: isDragging ? '#ebf4ff' : file ? '#f0fff4' : '#f7fafc',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
        >
          <input
            type="file"
            onChange={handleChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          
          {!file ? (
            <div style={{ pointerEvents: 'none' }}>
              <svg width="60" height="60" fill="none" viewBox="0 0 24 24" style={{ margin: '0 auto 20px' }}>
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                      stroke="#cbd5e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '8px'
              }}>
                Drag and drop your file here
              </p>
              <p style={{
                fontSize: '14px',
                color: '#718096',
                marginBottom: '20px'
              }}>or click to browse</p>
              <div style={{
                display: 'inline-block',
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}>
                Select File
              </div>
            </div>
          ) : (
            <div style={{ pointerEvents: 'none' }}>
              <svg width="60" height="60" fill="none" viewBox="0 0 24 24" style={{ margin: '0 auto 20px' }}>
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      stroke="#48bb78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '5px',
                wordBreak: 'break-word'
              }}>{file.name}</p>
              <p style={{
                fontSize: '14px',
                color: '#718096'
              }}>
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        {file && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
            <button
              onClick={handleUpload}
              disabled={status === 'uploading'}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: status === 'uploading' ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: status === 'uploading' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: status === 'uploading' ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.2s ease',
                transform: status === 'uploading' ? 'none' : 'scale(1)'
              }}
              onMouseOver={(e) => {
                if (status !== 'uploading') e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseOut={(e) => {
                if (status !== 'uploading') e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {status === 'uploading' ? (
                <>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload Code
                </>
              )}
            </button>
            
            <button
              onClick={removeFile}
              disabled={status === 'uploading'}
              style={{
                padding: '14px 24px',
                background: 'white',
                color: '#4a5568',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: status === 'uploading' ? 'not-allowed' : 'pointer',
                opacity: status === 'uploading' ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (status !== 'uploading') e.currentTarget.style.background = '#f7fafc';
              }}
              onMouseOut={(e) => {
                if (status !== 'uploading') e.currentTarget.style.background = 'white';
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {message && (
          <div style={{
            marginTop: '25px',
            padding: '16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            background: status === 'success' ? '#f0fff4' : status === 'error' ? '#fff5f5' : '#ebf8ff',
            border: `1px solid ${status === 'success' ? '#9ae6b4' : status === 'error' ? '#fc8181' : '#90cdf4'}`
          }}>
            {status === 'success' && (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px' }}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      stroke="#48bb78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {status === 'error' && (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px' }}>
                <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      stroke="#f56565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {status === 'uploading' && (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px', animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" stroke="#4299e1" strokeWidth="4" opacity="0.25"></circle>
                <path fill="#4299e1" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>
              </svg>
            )}
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: status === 'success' ? '#22543d' : status === 'error' ? '#742a2a' : '#2c5282',
              margin: 0
            }}>
              {message}
            </p>
          </div>
        )}
      </div>

      <div style={{
        maxWidth: '600px',
        margin: '20px auto 0',
        textAlign: 'center',
        fontSize: '14px',
        color: 'rgba(255,255,255,0.9)'
      }}>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}