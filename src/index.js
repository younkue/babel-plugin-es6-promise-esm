import template from 'babel-template'
import * as t from 'babel-types'

const buildPolyfill = template(`
  var PROMISE = typeof Promise === 'undefined'
    ? _ESPromise.Promise
    : Promise
`)

const replaceIdentifier = {
  ReferencedIdentifier (path) {
    const { node, scope } = path

    if (node.name !== 'Promise') return
    if (scope.getBindingIdentifier(node.name)) return

    path.replaceWith(this.getReplacement())
  }
}

export default function () {
  return {
    visitor: {
      Program (path) {
        const name = path.scope.generateUid('Promise')

        let used = false
        path.traverse(replaceIdentifier, {
          getReplacement () {
            used = true
            return t.identifier(name)
          }
        })

        if (used) {
          path.unshiftContainer('body', buildPolyfill({
            PROMISE: t.identifier(name)
          }));
          path.unshiftContainer('body',
            t.importDeclaration(
              [
                t.importDefaultSpecifier(t.identifier("_ESPromise"))
              ],
              t.stringLiteral("es6-promise")
            )
          );
        }
      }
    }
  }
}
