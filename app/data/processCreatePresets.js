import { client } from '../main'

export default [
    {
        name: 'Use existing directory',
        description: 'Create a process on an existing directory on the machine.',
        icon: 'folder',
        steps: [
            {
                name: 'Create directory',
            },
            {
                name: 'Create process on JanD',
            }
        ],
        create(process) {
        },
        validate(process, ctx) {   
        }
    }
]