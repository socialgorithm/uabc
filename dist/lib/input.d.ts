declare const commandLineArgs: any;
declare const getUsage: any;
declare const info: any;
declare const optionDefinitions: ({
    name: string;
    alias: string;
    description: string;
} | {
    name: string;
    description: string;
} | {
    name: string;
    alias: string;
    typeLabel: string;
    description: string;
} | {
    name: string;
    typeLabel: string;
    description: string;
})[];
declare const sections: ({
    header: string;
    content: string;
} | {
    header: string;
    optionList: ({
        name: string;
        alias: string;
        description: string;
    } | {
        name: string;
        description: string;
    } | {
        name: string;
        alias: string;
        typeLabel: string;
        description: string;
    } | {
        name: string;
        typeLabel: string;
        description: string;
    })[];
} | {
    header: string;
    content: string[];
})[];
declare function parseInput(): any;
