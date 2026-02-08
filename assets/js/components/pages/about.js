const elButton = document.getElementById("buttons-edit");


// elButton.addEventListener("submit", (e) => {
//     e.preventDefault();



// })

const urlMedia = [
    {
        github: "https://github.com/Duque-Paola",
        linkedin: "https://www.linkedin.com/in/paoladuquesalgado/"
    },
    {
        github: "https://github.com/AxlOlvera",
        linkedin: "https://www.linkedin.com/in/axl-sanchez/"
    },
    {
        github: "https://github.com/mont-sucres",
        linkedin: "https://www.linkedin.com/in/mont-sucres/"
    },
    {
        github: "https://github.com/jordyH54",
        linkedin: "https://www.linkedin.com/in/jordy-hernandezz/"
    },
    {
        github: "https://github.com/dlopezz97",
        linkedin: "https://www.linkedin.com/in/diego-lopezrdz/"
    },
    {
        github: "https://github.com/AppleMH",
        linkedin: "https://www.linkedin.com/in/genaro-corazon-developer-jr/"
    },
    {
        github: "https://github.com/IsaacLC1104",
        linkedin: "https://www.linkedin.com/in/isaacdevjr/"
    },
    {
        github: "https://github.com/UrsulaVela",
        linkedin: "https://www.linkedin.com/in/ursulavela/"
    },
    {
        github: "https://github.com/dianaibarra0303-ux",
        linkedin: "www.linkedin.com/in/dianaibarra0303/"
    },
    {
        github: "https://github.com/caradguadarrama",
        linkedin: "https://www.linkedin.com/in/carlosaguadarrama/"
    }
]

document.addEventListener('DOMContentLoaded', () => {
  const socialIcons = document.getElementsByClassName('social-media-div');

  if (socialIcons) {
    for(let i = 0; i < socialIcons.length; i++) {
        let githubUrl = urlMedia[i].github;
        let linkedinUrl = urlMedia[i].linkedin;
        socialIcons[i].innerHTML = createSocialIcons(githubUrl, linkedinUrl);
    }
  }
});

function createSocialIcons(githubUrl, linkedinUrl){
    return `<a href="${githubUrl}" target = "_blank" class="social-link"><img src="/assets/img/gitHub.svg" class="social-icon"></a>
            <a href="${linkedinUrl}" target = "_blank" class="social-link"><img src="/assets/img/linkedin.svg" class="social-icon"></a>`
}