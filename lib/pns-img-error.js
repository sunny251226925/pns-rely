export default function(){
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.imgError) {
          attrs.$set('src', attrs.imgError);
        }
      });
    }
  }
}