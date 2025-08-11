
    const exprEl = document.getElementById('expr');
    const resultEl = document.getElementById('result');
    let expression = '';
    function updateDisplays(){
      exprEl.textContent = expression || '0';
      const safe = expression.replace(/×/g,'*').replace(/÷/g,'/').replace(/[^0-9+\-*/().% ]/g,'');
      try{
        if(safe.trim()==='') return resultEl.textContent = '0';
        const value = Function('return ('+safe+')')();
        if(Number.isFinite(value)){
          resultEl.textContent = String(Math.round((value + Number.EPSILON) * 100000000) / 100000000);
        } else resultEl.textContent = 'Err';
      }catch(e){
        resultEl.textContent = '';
      }
    }
    function push(inp){
      if(inp==='percent'){
        expression = expression + '%';
        updateDisplays();
        return;
      }
      if(inp==='back'){
        expression = expression.slice(0,-1);
        updateDisplays();
        return;
      }
      if(inp==='clear'){
        expression=''; updateDisplays(); return;
      }
      if(inp==='equals'){
        const safe = expression.replace(/×/g,'*').replace(/÷/g,'/').replace(/%/g,'/100');
        try{
          const value = Function('return ('+safe+')')();
          if(Number.isFinite(value)){
            expression = String(Math.round((value + Number.EPSILON) * 100000000) / 100000000);
            updateDisplays();
          } else {
            resultEl.textContent = 'Err';
          }
        }catch(e){ resultEl.textContent = 'Err'; }
        return;
      }
      expression += inp;
      updateDisplays();
    }
    document.getElementById('keys').addEventListener('click', e =>{
      const btn = e.target.closest('button'); if(!btn) return;
      const v = btn.dataset.value; const a = btn.dataset.action;
      if(a) push(a); else push(v);
    });
    window.addEventListener('keydown', e =>{
      if(e.metaKey || e.ctrlKey) return;
      if(e.key === 'Enter' || e.key === '='){ e.preventDefault(); push('equals'); return; }
      if(e.key === 'Backspace'){ e.preventDefault(); push('back'); return; }
      if(e.key === 'Escape'){ e.preventDefault(); push('clear'); return; }
      if(e.key === '%'){ e.preventDefault(); push('percent'); return; }
      const map = {'/':'/','*':'*','x':'*','X':'*','-':'-','+':'+','.' : '.'};
      if(/[0-9]/.test(e.key)){ push(e.key); return; }
      if(map[e.key]){ push(map[e.key]); return; }
    });
    updateDisplays();
