/*
* Downgrade from es6 modules to commonJS
*
* INPUT:
*
* import fs from 'fs'
* import {getWhatever, findWhatever} from 'library'
* import settings from './settings';
* import homeRoute from './routes/home';
* import App from './routes/App';
* import stockOptionsGameRoute from './routes/stock-options-game';
*
* export function wawa() { return 0;  }
* export default (req, res) => { return true }
* export const MARKER_REMOVED_OUT = 'MARKER_REMOVED_OUT';
*
*
* OUTPUT
*
* const fs = require('fs');
* const {getWhatever, findWhatever} = require('library');
* const settings = require('./settings');
* const homeRoute = require('./routes/home');
* const App = require('./routes/App');
* const stockOptionsGameRoute = require('./routes/stock-options-game');
*
* exports.funsi = function () {}
* exports.hello = 'hi'
* module.exports = { a: 1  }
*
* NOTE:
* You will still need to remap the destructured expressions
*
*/

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root =  j(file.source);

  const exp = root
    .find(j.ExportNamedDeclaration)
    .replaceWith(p => {
      if (p.value.declaration.type === 'VariableDeclaration') {
        return j.expressionStatement(
          j.assignmentExpression(
            '=',
            j.memberExpression(
              j.identifier('exports'),
              j.identifier(p.value.declaration.declarations[0].id.name)
            ),
            j.literal(p.value.declaration.declarations[0].init.value)
          )
        )
      }

      if (p.value.declaration.type === 'FunctionDeclaration') {
        return j.expressionStatement(
          j.assignmentExpression('=',
            j.memberExpression(
              j.identifier('exports'),
              j.identifier(p.value.declaration.id.name)
            ),
            j.functionExpression(
              j.identifier(p.value.declaration.id.name),
              p.value.declaration.params,
              j.blockStatement(p.value.declaration.body.body)
            )
          )
        )
      }
    })

  const expDef = root
    .find(j.ExportDefaultDeclaration)
    .replaceWith(p => {
      if (p.value.declaration.type === 'ArrowFunctionExpression') {
        return j.expressionStatement(
            j.assignmentExpression('=',
               j.memberExpression(
                 j.identifier('module'),
                 j.identifier('exports')
               ),
            j.arrowFunctionExpression(
              p.value.declaration.params,
              j.blockStatement(p.value.declaration.body.body)
            )
          )
        )
      }
    })


  function setVariableName (node) {
    if (node.specifiers.length > 1) {
      return j.identifier(node.source.value.split('/').pop())
    }
    return j.identifier(node.specifiers[0].local.name)
  }

  const imps = root
    .find(j.ImportDeclaration)
    .replaceWith(p => {
      return j.variableDeclaration("const", [
          j.variableDeclarator(
            setVariableName(p.value),
            j.callExpression( j.identifier('require'), [j.literal(p.value.source.value)]
          )
        )
      ]);
    })

  return root.toSource({quote: 'single' });
};


