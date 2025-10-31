
export function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (document.getElementById("google-client-script")) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.id = "google-client-script"

    script.onload = () => {
      console.log("Google Identity script cargado ✅")
      resolve()
    }

    script.onerror = () => {
      reject("Error al cargar Google Identity script ❌")
    }

    document.head.appendChild(script)
  })
}
