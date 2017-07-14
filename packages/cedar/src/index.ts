// TODO: need to set up cedar-utils prepublish and .npmignore
// so that we are pulling in built code, not source, something like:
// import { deepMerge } from 'cedar-utils/helpers'
import { deepMerge } from 'cedar-utils/src/helpers/helpers'

export class Cedar {
    // constructor () {
    // }

    // NOTE: this is just psudo code to demonstrate we got the monorepo wired up
    show (domNode, options) {
        const defaults = {
            renderer: 'svg',
            autolabels: false
        }
        const opts = deepMerge({}, defaults, options)
        console.log(opts)
    }
}
