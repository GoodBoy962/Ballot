# Etherium cli-application for Ballot

## To start
deploy the contract **Ballot.sol** and then change the **address** field in the **Ballot.json** file

Arguments:

1. Full path to the file[1]
2. Command with argument, if they should be[2]

# [1] File with keys example:

`{ "address" : "0xa5e131781eeab82c9b229617e0e1827706391d00", "key" : "3c4c2810c56dc6223d5089bc60f76684e664b4d010c45a5abd77752d7e200230" }`

# [2] Commands

action                | command
--------------------- | -----------------------------------------------------------
Get list of proposals | node ballot.js **view**
Vote                  | node ballot.js **vote** {proposalId} {value, true or false}
Finish the proposal   | node ballot.js **f** {proposalId}
Remove the proposal   | node ballot.js **rm** {proposalId}
Create new proposal 	| node ballot.js **create** {theme, without spaces}
