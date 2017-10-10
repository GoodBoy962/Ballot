pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

contract Owned {

    address public owner;

    function Owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

}

contract Ballot is Owned {

    function Ballot() {
        owner = msg.sender;
    }

    struct Proposal {
        string theme;
        uint   countFor;
        uint   countAgainst;
        bool   active;
    }

    Proposal[] public proposals;

    mapping(uint => address[]) votesForProposal;

    function applyProposal(string _theme) onlyOwner {
        proposals.push(Proposal({
            theme: _theme,
            countFor: 0,
            countAgainst: 0,
            active: true
        }));
    }

    function finishProposal(uint proposalId) onlyOwner returns(uint, uint) {
        Proposal storage proposal = proposals[proposalId];
        proposal.active = false;
        return (proposal.countFor, proposal.countAgainst);
    }

    function removeProposal(uint proposalId) onlyOwner {
        delete votesForProposal[proposalId];
        delete proposals[proposalId];
    }

    function vote(uint proposalId, bool _decision) public {
        require(proposals[proposalId].active);

        address[] storage _voters = votesForProposal[proposalId];
        for (uint i = 0; i < _voters.length; i++) {
            require(_voters[i] != msg.sender);
        }
        _voters.push(msg.sender);

        Proposal storage proposal = proposals[proposalId];
        if (_decision) {
            proposal.countFor++;
        } else {
            proposal.countAgainst++;
        }
    }

    function getProposals() returns (Proposal[] _p) {
        _p = proposals;
    }

}
