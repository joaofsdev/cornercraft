function curtirVideo(videoId) {
    fetch(`/videos/curtir/${videoId}`, {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('token') || localStorage.getItem('token') || '',
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => alert(data.mensagem || 'Vídeo curtido com sucesso'))
    .catch(err => alert('Erro ao curtir vídeo: ' + err.message));
}