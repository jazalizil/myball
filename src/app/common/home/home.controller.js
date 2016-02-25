/**
 * Created by jazalizil on 20/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('HomeController', HomeController);
  /** @ngInject */
  function HomeController(gettextCatalog, Conf) {
    var vm = this;
    vm.data = {
      imgs : {
        carousel : [
          {
            src: "assets/images/soccer-players.png",
            titles: [
              gettextCatalog.getString("Vous jouez au foot ?"),
              gettextCatalog.getString("Organisez des matchs rapidement avec weBall !")
            ],
            subTitles: [
              gettextCatalog.getString("Et si organiser un match devenait un jeu d'enfants ?"),
              gettextCatalog.getString("Trouvez un five, Invitez vos amis et"),
              gettextCatalog.getString("Passez des moments incroyables avec les joueurs de votre choix !")
            ],
            alt: gettextCatalog.getString("joueurs de foot")
          },
          {
            src: "assets/images/footsalle-field.png",
            titles: [
              gettextCatalog.getString("Vous gérez un Five ?"),
              gettextCatalog.getString("Devenez partenaire de la communauté weBall !")
            ],
            subTitles: [
              gettextCatalog.getString("Donnez de la visibilité à votre enseigne et triplez vos réservations"),
              gettextCatalog.getString("Bénéficiez de myBall, le meilleur outil pour gérer vos réservations")
            ],
            alt: gettextCatalog.getString("terrain five")
          }
        ],
        map: 'assets/images/weball-iphone-map.png',
        profil: 'assets/images/weball-iphone-profil.png',
        matchs: 'assets/images/weball-iphone-matchs.png'
      }
    }
  }
})();