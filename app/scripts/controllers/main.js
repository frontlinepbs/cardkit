'use strict';

/**
 * @ngdoc function
 * @name cardkitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cardkitApp
 */
angular.module('cardkitApp')
  .controller('MainCtrl', function ($scope, saveSvgAsPng, themeConfig) {
    //window._scope = $scope;
    $scope.config = {
      sizes: [
        {
          name: 'Facebook',
          width: 800,
          height: 370,
        },
        {
          name: 'Twitter',
          width: 650,
          height: 320,
        },
        {
          name: 'Video',
          width: 640,
          height: 360,
        },
      ],
      themes: themeConfig,
      output: {
        scale: 2,
        editable: {
          scale: true
        }
      },
      svg: {
        canvas: {
          height: function() {
            return $scope.size.height;
          },
          width: function() {
            return $scope.size.width;
          },
        },
        elements: [
          {
            name: 'Background Colour',
            type: 'rect',
            height: function() {
              return $scope.size.height;
            },
            width: function() {
              return $scope.size.width;
            },
            fill: function() {
              return $scope.theme.background;
            },
            editable: {
              fill: 'picker'
            }
          },
          {
            name: 'Image',
            type: 'image',
            width: 600,
            height: function() {
              return this.width;
            },
            src: '',
            opacity: 1,
            x: '0%',
            y: '0%',
            preserveAspectRatio: 'xMinYMin meet',
            draggable: true,
            defaultFilter: '',
            editable: {
              src: true,
              width: true,
              opacity: true,
              filters: [
                'Sepia',
                'Grayscale',
                'Saturate',
                'Invert',
                'Blur'
              ],
            }
          },
          {
            name: 'Logo',
            type: 'image',
            width: 150,
            height: function() {
              return this.width / 2;
            },
            src: function() {
              return $scope.theme.logoSrc;
            },
            opacity: 1,
            x: function() {
              return $scope.size.width - this.width * 1.5;
            },
            y: function() {
              return $scope.size.height - this.height();
            },
            preserveAspectRatio: 'xMinYMin meet'
          },
          {
            name: 'Headline',
            type: 'text',
            text: function() {
              return $scope.theme.headlineText;
            },
            fill: function() {
              return $scope.theme.quote;
            },
            fontSize: 40,
            fontFamily: function() {
              return $scope.theme.headlineFont;
            },
            lineHeight: function() {
              return this.fontSize * 1.25;
            },
            textAnchor: 'start',
            x: 50,
            y: 75,
            draggable: true,
            editable: {
              text: true,
              fill: 'picker',
              textAnchor: true,
              fontSize: {
                'Small (18px)': 18,
                'Medium (26px)': 26,
                'Large (32px)': 32,
                'Extra Large (40px)': 40,
              },
            },
          },
          {
            name: 'Subtitle',
            type: 'text',
            opacity: 0.65,
            text: function() {
              return $scope.theme.subtitleText;
            },
            fill: function() {
              return $scope.theme.quote;
            },
            fontSize: 18,
            fontFamily: function() {
              return $scope.theme.headlineFont;
            },
            lineHeight: function() {
              return this.fontSize * 1.25;
            },
            textAnchor: 'start',
            x: 50,
            y: 150,
            draggable: true,
            editable: {
              text: true,
              fill: 'picker',
              textAnchor: true,
              fontSize: {
                'Small (18px)': 18,
                'Medium (26px)': 26,
                'Large (32px)': 32,
                'Extra Large (40px)': 40,
              },
            },
          },
          {
            name: 'Hashtag',
            type: 'text',
            text: '#frontlinepbs',
            fill: function() {
              return $scope.theme.quote;
            },
            fontSize: 32,
            fontFamily: 'cooper_hewittlight',
            textAnchor: 'start',
            x: 50,
            y: function() {
              return $scope.size.height - 40;
            },
            draggable: true,
            editable: {
              text: true,
              fill: 'picker',
              textAnchor: true,
              fontSize: {
                'Small (18px)': 18,
                'Medium (26px)': 26,
                'Large (32px)': 32,
                'Extra Large (40px)': 40,
              },
            },
          },
          {
            name: 'URL',
            type: 'text',
            text: '',
            fill: function() {
              return $scope.theme.quote;
            },
            fontSize: 21,
            fontFamily: 'cooper_hewittlight',
            textAnchor: 'start',
            editable: {
              text: true,
              fill: 'picker'
            },
            x: function() {
              var logo = $scope.config.svg.elements[2];
              return logo.x();
            },
            y: function() {
              var logo = $scope.config.svg.elements[2];
              return logo.y() - this.fontSize;
            }
          }
        ]
      }
    };

    function createConfigCopy() {
      $scope.defaultConfig = angular.copy($scope.config);
      $scope.$broadcast('resetSvg');
    }

    if(typeof $scope.config.themes !== 'undefined') {
      $scope.theme = ($scope.config.themes.length > 1) ? null : $scope.config.themes[0];
    }

    $scope.size = ($scope.config.sizes.length > 1) ? null : $scope.config.sizes[0];

    $scope.$watch('theme', function() {
      $scope.$broadcast('changeTheme');
      createConfigCopy();
    });

    $scope.$watch('size', function() {
      $scope.$broadcast('changeSize');
      createConfigCopy();
    });

    $scope.resetSvg = function() {
      $scope.config.svg = $scope.defaultConfig.svg;
      createConfigCopy();
    };

    // Drop handler.
    $scope.onDrop = function (data, event, key) {
      var dataTransfer = getDataTransfer(event);
      readFile(dataTransfer.files[0], key);
    };

    $scope.fileChanged = function(file) {
      readFile(angular.element(file)[0].files[0], angular.element(file).data('key'));
    };

    // Read the supplied file (from DataTransfer API)
    function readFile(file, key) {
      var reader = new FileReader();

      reader.onload = function() { 
        $scope.config.svg.elements[key].src = reader.result;
        $scope.$apply();
      };

      reader.readAsDataURL(file);
    }

    // Get the data transfer
    function getDataTransfer(event) {
      event.stopPropagation();
      event.preventDefault();
      return event.dataTransfer || null;
    }

    $scope.removeImage = function(key) {
      $scope.config.svg.elements[key].src = '';
    };


    $scope.downloadSvg = function() {
      saveSvgAsPng(document.getElementById('snap-svg'), 'image.png', {
        scale: $scope.config.output.scale
      });
    };
  });
