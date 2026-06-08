import { useState } from 'react';

const PASSWORD = '0327';

export default function PasswordModal({ action, onConfirm, onClose }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const actionLabel = action === 'write' ? '작성' : '삭제';

  const handleConfirm = () => {
    if (input === PASSWORD) {
      onConfirm();
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">비밀번호 확인</h2>
        <p className="modal-desc">글을 {actionLabel}하려면 비밀번호를 입력하세요.</p>

        <input
          className="modal-password-input"
          type="password"
          placeholder="비밀번호"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          autoFocus
        />

        {error && (
          <p className="modal-error">
            글을 {actionLabel}하고 싶다면 하유진에게 문의하세요.
          </p>
        )}

        <div className="modal-actions">
          <button className="modal-cancel-btn" onClick={onClose}>취소</button>
          <button className="modal-confirm-btn" onClick={handleConfirm}>확인</button>
        </div>
      </div>
    </div>
  );
}
