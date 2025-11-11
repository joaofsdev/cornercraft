/**
 * Registra um like em um vídeo
 * @param {string|number} videoId - ID do vídeo a ser curtido
 */
async function curtirVideo(videoId) {
  try {
    const response = await fetch(`/videos/video/${videoId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (data.success) {
      console.log("Vídeo curtido com sucesso");
      // Atualiza a UI se necessário
      const likeButton = document.querySelector(`[data-video-id="${videoId}"][data-action="like"]`);
      if (likeButton) {
        likeButton.classList.add("active");
      }
    } else {
      console.warn("Erro ao curtir vídeo:", data.message || "Erro desconhecido");
      if (data.message === "Usuário não autenticado") {
        window.location.href = "/auth/login";
      }
    }
  } catch (error) {
    console.error("Erro ao curtir vídeo:", error);
  }
}