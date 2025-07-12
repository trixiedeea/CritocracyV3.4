// End of Turn cards
export const endOfTurnDeck = [
    {
        deck: "End of Turn",
        name: "The Reclamation of Historical Spaces",
        description: "Césaire urges a reexamination of the spaces that uphold colonial memory, calling for the reclamation of monuments and land. The battle for who controls these spaces remains central to decolonization.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -3, influence: -4 }, explanation: "Reclamation efforts disrupt your holdings and narratives." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 2, influence: 5 }, explanation: "Successful actions boost morale and resources." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 2 }, explanation: "Documenting change requires funding but yields knowledge." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: 0, influence: -2 }, explanation: "Market uncertainty impacts funds, but opportunities arise." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: -1, influence: 3 }, explanation: "Navigating the issue brings political gains and costs." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 4 }, explanation: "Your art reflects the moment, gaining influence." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Rise of Historical Revisionism",
        description: "Historical revisionism emerges as a dominant force in shaping current ideologies. Barthes suggests that all texts are open to reinterpretation, while Césaire emphasizes the revision of colonial narratives.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: 5, knowledge: 2, influence: -3 }, explanation: "Revisionism bolsters your finances but costs influence." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -3, influence: 1 }, explanation: "Fighting revisionism is costly and difficult." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: -2 }, explanation: "Intense study yields knowledge but attracts criticism." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 4, knowledge: 1, influence: -1 }, explanation: "Capitalizing on revisionism has financial rewards and risks." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -3, influence: 6 }, explanation: "Manipulating narratives boosts influence significantly." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: 3, influence: -4 }, explanation: "Your critical art struggles against revisionist trends." }
        }
    },
    {
        deck: "End of Turn",
        name: "Digital Archives and the Battle for History",
        description: "Digital archives democratize access to history, but also raise questions about who controls these records. Benjamin's theory on technological reproducibility highlights the impact of mass media in reshaping art and history.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: 1, influence: -4 }, explanation: "Loss of narrative control impacts influence and finances." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 3 }, explanation: "Digital tools aid organization and spread knowledge." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 4, influence: 1 }, explanation: "Curating digital archives brings recognition and some funding." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: 3 }, explanation: "Competition forces adaptation, offering new influence avenues." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -2, influence: -2 }, explanation: "Lack of control over digital records proves challenging." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 5 }, explanation: "Digital platforms amplify your artistic reach." }
        }
    },
    {
        deck: "End of Turn",
        name: "Colonial Monuments and the Battle for Public Memory",
        description: "The debate around the removal or preservation of colonial monuments escalates. Césaire calls for the rejection of symbols that perpetuate colonial dominance.",
        effects: {
            Colonialist: { type: 'RESOURCE_CHANGE', changes: { money: -6, knowledge: -2, influence: -2 }, explanation: "You are forced to protect colonial monuments at great expense." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 1, influence: 6 }, explanation: "You lead protests that demand the removal of colonial symbols." },
            Historian: { type: 'RESOURCE_CHANGE', changes: { money: 0, knowledge: 5, influence: 1 }, explanation: "You research the history of colonial monuments." },
            Entrepreneur: { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -1, influence: -2 }, explanation: "You face financial fallout from your association with colonial symbols." },
            Politician: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 0, influence: 5 }, explanation: "You pass legislation to protect colonial monuments." },
            Artist: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 6 }, explanation: "Your work advocates for the removal of colonial monuments." }
        }
    },
    {
        deck: "End of Turn",
        name: "Social Media Debates on Colonial Legacies",
        description: "Social media becomes a battleground for debates about colonialism and its legacies. Benjamin's critique of historical narrative and Barthes' notion of authorship become central to the conversation.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -3, influence: -5 }, explanation: "Public backlash against your role in colonial history spreads on social media." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 2, influence: 5 }, explanation: "Your voice is amplified on digital platforms." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: 1 }, explanation: "You document the heated debates around colonial legacies." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: 0, influence: -2 }, explanation: "Your business faces a boycott due to its association with colonial history." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: -2, influence: 4 }, explanation: "You take advantage of social media to promote your policies." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 5 }, explanation: "Your work provokes thought on colonial legacies on social media." }
        }
    },
    {
        deck: "End of Turn",
        name: "Historians vs. Victims of History",
        description: "The historian's role in interpreting history is contested. Benjamin's 'Angel of History' is caught in the winds of progress, unable to change the past, while Césaire demands that history be reinterpreted from the perspectives of the oppressed.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "You can't control the narrative as effectively." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 2 }, explanation: "Your arguments resonate in the contest over historical interpretation." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -5, influence: 1 }, explanation: "You are caught in the crossfire between the victims and the perpetrators." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -2, influence: 1 }, explanation: "You lose clients who favor the reinterpretation of history." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 1, influence: 4 }, explanation: "You ally with historians to shape the narrative in your favor." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 3 }, explanation: "Your art supports the voice of the oppressed." }
        }
    },
    {
        deck: "End of Turn",
        name: "Repatriation of Cultural Artifacts",
        description: "The call for the return of looted cultural artifacts from colonial powers gains traction. Césaire and Tuck & Yang advocate for reparations that include cultural restitution.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -6, knowledge: -3, influence: -2 }, explanation: "You are forced to return cultural artifacts, reducing your wealth." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 5 }, explanation: "Your activism drives the push for reparations." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: 2 }, explanation: "You contribute to the academic discourse on repatriation." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -2, influence: -1 }, explanation: "Your profits decline as demand for stolen artifacts wanes." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 1, influence: 4 }, explanation: "You oversee the repatriation process and gain political capital." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 5 }, explanation: "Your work supports the call for cultural repatriation." }
        }
    },
    {
        deck: "End of Turn",
        name: "Artificial Intelligence and the Question of Identity",
        description: "AI challenges traditional notions of identity, as algorithms start to shape perceptions of gender and race. Butler's theory of performative identity and Mulvey's concept of the male gaze are essential for understanding how these technologies might reinforce or subvert social norms.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: -3, influence: -4 }, explanation: "AI is used to challenge colonial ideologies." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 5, influence: 2 }, explanation: "You study AI's impact on identity formation." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: -1 }, explanation: "You document the intersection of AI and identity." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 5, knowledge: 2, influence: 1 }, explanation: "You capitalize on the growing AI industry." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -3, influence: -3 }, explanation: "AI challenges your control over the political landscape." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 1, influence: 4 }, explanation: "You critique the role of AI in shaping cultural narratives." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Globalization of Resistance",
        description: "Global movements for justice and decolonization intersect, transcending national borders. Tuck & Yang stress that decolonization is a process, not just a metaphor, and Benjamin's 'Angel of History' observes the international nature of resistance.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -3, influence: -4 }, explanation: "Your global influence is weakened by rising resistance." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 4, knowledge: 4, influence: 5 }, explanation: "Your international alliances strengthen your cause." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: 2 }, explanation: "You document the rise of transnational resistance." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "Global instability threatens your business." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: -1, influence: 5 }, explanation: "You align with international powers to suppress revolts." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 4 }, explanation: "Your art spreads the message of global solidarity." }
        }
    },
    {
        deck: "End of Turn",
        name: "Gender and the Performance of Power",
        description: "Gender as a social performance intersects with power dynamics. Butler's theory of gender performativity is applied to how power is exercised through gendered performances, while Césaire critiques the colonial systems that reinforced gender norms.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -4 }, explanation: "You are caught in a backlash against patriarchal colonial systems." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 3 }, explanation: "You adopt gender as a revolutionary tool." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 0, knowledge: 4, influence: 1 }, explanation: "You analyze the gendered power dynamics in colonial history." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -2, influence: 0 }, explanation: "Your gendered advertising strategies are criticized." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: -2, influence: 5 }, explanation: "You use gender politics to consolidate power." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 4 }, explanation: "Your work critiques the performance of gendered power." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Spectacle of Colonial Violence",
        description: "The spectacle of colonial violence, captured in media, is revisited. Benjamin's idea of the historical 'spectacle' forces a reconsideration of colonial violence and its ongoing impact.",
        effects: {
            Colonialist: { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -2, influence: -6 }, explanation: "Your actions are exposed and criticized for their violence." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 6, influence: 4 }, explanation: "You expose the violence as a tool for resistance." },
            Historian: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: 1 }, explanation: "You document the ongoing impact of colonial violence." },
            Entrepreneur: { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -1, influence: -2 }, explanation: "You are targeted for profiteering from violence." },
            Politician: { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: 5 }, explanation: "You use the spectacle to manipulate public opinion." },
            Artist: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 7 }, explanation: "Your art sparks a public outcry over colonial violence." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Rise of Neo-Colonialism",
        description: "Neo-colonialism rises as multinational corporations and political structures continue to dominate formerly colonized nations. Césaire's critique of economic exploitation and Tuck & Yang's ideas about decolonization are at the heart of this phenomenon.",
        effects: {
            Colonialist: { type: 'RESOURCE_CHANGE', changes: { money: 7, knowledge: 2, influence: 3 }, explanation: "You benefit from economic domination in a neo-colonial system." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -3, influence: -5 }, explanation: "Your resistance is hindered by neo-colonial systems." },
            Historian: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 6, influence: 0 }, explanation: "You analyze the rise of neo-colonialism in modern contexts." },
            Entrepreneur: { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -2, influence: -2 }, explanation: "You face backlash against neo-colonial business practices." },
            Politician: { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 1, influence: 6 }, explanation: "You implement policies that support neo-colonial interests." },
            Artist: { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -5 }, explanation: "Your critique is marginalized in the face of neo-colonial power." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Rise of Queer Theories",
        description: "Queer theory emerges as a powerful critique of normative structures. Sedgwick's exploration of queer identity and Butler's theory of gender as performative action challenge conventional ideas about gender and sexuality.",
        effects: {
            Colonialist: { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -3, influence: -6 }, explanation: "Your patriarchal system is challenged by queer theories." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 6, influence: 4 }, explanation: "You incorporate queer theory into your resistance movements." },
            Historian: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: 1 }, explanation: "You document the influence of queer theory on modern struggles." },
            Entrepreneur: { type: 'RESOURCE_CHANGE', changes: { money: 7, knowledge: 1, influence: 3 }, explanation: "You profit from the emerging demand for queer-inclusive products." },
            Politician: { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: 5 }, explanation: "You use queer theory to connect with marginalized groups." },
            Artist: { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 4, influence: 6 }, explanation: "Your art incorporates and critiques normative gender roles." }
        }
    },
    {
        deck: "End of Turn",
        name: "Revolutionary Movements and the State's Reaction",
        description: "Revolutionary movements are met with increasing repression. Benjamin's critique of state violence and Césaire's call for anti-colonial resistance highlight the tension between revolutionary acts and state control.",
        effects: {
            Colonialist: { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -2, influence: -1 }, explanation: "You are forced to fund counterinsurgency efforts." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 2, influence: 6 }, explanation: "Your movement grows despite state repression." },
            Historian: { type: 'RESOURCE_CHANGE', changes: { money: 0, knowledge: 5, influence: 1 }, explanation: "You document the state's response to revolutionary movements." },
            Entrepreneur: { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -1, influence: -2 }, explanation: "Your business is targeted by revolutionary movements." },
            Politician: { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: -1, influence: 7 }, explanation: "You use repression to suppress revolutionaries." },
            Artist: { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 2, influence: 6 }, explanation: "Your art inspires revolutionary movements." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Ethics of Representation in Postcolonial Art",
        description: "Postcolonial artists grapple with representing their identities within a Western framework. Césaire calls for a reclamation of representation, while Mulvey critiques the ways in which Western cinema constructs the 'Other.'",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -2, influence: -1 }, explanation: "Your depictions of the 'Other' are now widely criticized." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 5 }, explanation: "Your postcolonial art inspires resistance." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 4, influence: 1 }, explanation: "You analyze the ethical implications of art in postcolonial contexts." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -2, influence: 1 }, explanation: "You lose clients who are alienated by postcolonial art." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -3 }, explanation: "Your propaganda is challenged by critical art." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 1, influence: 4 }, explanation: "You gain recognition for your postcolonial critique." }
        }
    },
    {
        deck: "End of Turn",
        name: "Neocolonial Media and the Reproduction of Ideology",
        description: "Media, particularly film and television, is used to reproduce colonial ideologies. Benjamin's theory of the technological reproducibility of art and Barthes' concept of authorship highlight the role of media in shaping public perception.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 4 }, explanation: "You control the media and continue to shape colonial narratives." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -3 }, explanation: "Your message is overshadowed by dominant media ideologies." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 0, knowledge: 4, influence: 1 }, explanation: "You study the role of media in perpetuating colonial ideologies." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 1, influence: 1 }, explanation: "You capitalize on media that supports colonial narratives." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: -1, influence: 4 }, explanation: "You manipulate media to further your political agenda." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -4 }, explanation: "Your critiques of media representation are ignored." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Colonial Gaze in Popular Cinema",
        description: "The colonial gaze persists in contemporary media, objectifying and infantilizing colonized peoples. Mulvey's concept of the male gaze and Césaire's critique of colonial objectification intersect in the film industry's portrayal of the colonized.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 1, influence: 3 }, explanation: "You continue to profit from the colonial gaze in media." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -4 }, explanation: "Your critiques of the gaze are overshadowed by popular media." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 0 }, explanation: "You analyze the colonial gaze in historical and modern cinema." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "You face a backlash from consumers demanding decolonized media." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: -1, influence: 4 }, explanation: "You exploit media to reinforce the colonial gaze." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 4 }, explanation: "Your work critiques and challenges colonial representation in media." }
        }
    },
    {
        deck: "End of Turn",
        name: "Technology and the Commodification of History",
        description: "Technology transforms how history is recorded and remembered. Benjamin critiques the technological reproduction of history, which reduces it to a commodity.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -3, influence: -3 }, explanation: "The commodification of history exposes your narratives as false." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 2 }, explanation: "You leverage technology to spread alternative histories." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 3, influence: 1 }, explanation: "You document the commodification of historical memory." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 4, knowledge: 1, influence: 1 }, explanation: "You profit from the demand for digital history." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -2, influence: -3 }, explanation: "Your manipulation of historical memory is exposed." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 3 }, explanation: "Your art critiques the commodification of history." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Politics of Memory in Postcolonial Societies",
        description: "Memory is a powerful tool in postcolonial societies. Tuck & Yang emphasize the importance of how the past is remembered and reclaimed in decolonization, while Césaire calls for the erasure of colonial memory.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "You face resistance from movements reclaiming history." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 5 }, explanation: "Your movement thrives by controlling memory." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 1 }, explanation: "You contribute to memory studies in postcolonial contexts." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -2, influence: -1 }, explanation: "Your business is boycotted for perpetuating colonial memory." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: -1, influence: 3 }, explanation: "You use memory politics to maintain power." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 1, influence: 4 }, explanation: "Your work reclaims and reshapes historical memory." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Performance of Identity in Digital Spaces",
        description: "Digital platforms become stages for identity performance. Butler's theory of performativity and Sedgwick's work on queer identity provide insights into how online identities are constructed and contested.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -3 }, explanation: "Digital spaces challenge your identity construction." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 2 }, explanation: "You use digital platforms for identity performance." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 0, knowledge: 4, influence: 1 }, explanation: "You study digital identity construction." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 4, knowledge: 1, influence: 1 }, explanation: "You capitalize on digital identity trends." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -4 }, explanation: "Digital identities challenge your control." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 1, influence: 4 }, explanation: "Your art explores digital identity performance." }
        }
    },
    {
        deck: "End of Turn",
        name: "Technological Surveillance and Historical Control",
        description: "Surveillance technology impacts how history is controlled and contested. Benjamin's critique of historical narratives and Césaire's analysis of colonial control intersect in debates about technology and power.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -2, influence: -2 }, explanation: "Your movement is suppressed by surveillance." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: -1, influence: -5 }, explanation: "Your movement is suppressed by surveillance." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 1 }, explanation: "You analyze the role of technology in historical control." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "You face backlash against surveillance technologies." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: -1, influence: 5 }, explanation: "You use surveillance to maintain power." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -1, influence: -4 }, explanation: "Your art critiques surveillance culture." }
        }
    },
    {
        deck: "End of Turn",
        name: "Global Networks of Resistance",
        description: "Decolonization is not just a local or national effort but a global struggle. Tuck and Yang highlight the importance of international solidarity in dismantling colonial structures.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -3 }, explanation: "Global resistance movements drain your resources." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 5 }, explanation: "You unite global movements under a common cause." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 4, influence: 1 }, explanation: "You study global networks and their resistance strategies." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -1, influence: -2 }, explanation: "Your business suffers as global resistance boycotts your products." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 1, influence: 3 }, explanation: "Your diplomatic ties help stabilize the global situation." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 4 }, explanation: "Your artwork spreads the message of global resistance." }
        }
    },
    {
        deck: "End of Turn",
        name: "History is Written by the Victors",
        description: "The narrative of history is shaped by those who hold power. Barthes and Benjamin challenge the idea that history is impartial or fixed, proposing that it is always a product of power dynamics.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: 4, knowledge: 2, influence: 1 }, explanation: "You continue to benefit from the dominant historical narrative." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -5, influence: -2 }, explanation: "The dominant narrative suppresses your efforts." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: -1 }, explanation: "You uncover the hidden histories of the oppressed." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "Your company profits from the dominant but morally questionable history." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -3, influence: -4 }, explanation: "The public questions your role in shaping historical narratives." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 3 }, explanation: "You produce works that challenge the dominant historical perspective." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Rejection of the Colonial Past",
        description: "Césaire highlights the psychological and social trauma left by colonial rule. This rejection of the colonial past signifies a collective turning point where societies reclaim their identities and question the imposed systems of power.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -6, knowledge: -2, influence: -1 }, explanation: "The societal rejection of your legacy erodes your wealth." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 1, influence: 5 }, explanation: "Your call for liberation is gaining more support." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 5, influence: 1 }, explanation: "You now record the collective resistance against colonialism." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -1, influence: -1 }, explanation: "Your colonial ventures are devalued in the market." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -4 }, explanation: "Your power is challenged by the rejection of colonialism." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 6 }, explanation: "Your artistic interpretation becomes a symbol of postcolonial identity." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Rise of Postcolonial Literature",
        description: "As writers from formerly colonized countries gain prominence, their works become vehicles for reinterpreting history and identity. Barthes' idea of the death of the author is evident as these new voices challenge established literary canons.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { influence: -5 }, explanation: "Your Colonialist narratives are increasingly disregarded." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { knowledge: 7 }, explanation: "You study and propagate postcolonial literary works." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { knowledge: 5 }, explanation: "You now have access to a rich body of postcolonial literature." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 6 }, explanation: "You profit from the growing interest in postcolonial literature." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { influence: -5 }, explanation: "You struggle to silence new postcolonial voices." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { influence: 6 }, explanation: "Your art is inspired by the new postcolonial literary movements." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Struggle Over Education Systems",
        description: "Césaire critiques the colonial education system for perpetuating inferiority among colonized people. The struggle over education becomes central to the decolonization effort, as people demand a return to indigenous knowledge and ways of thinking.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -5 }, explanation: "Your control over educational institutions diminishes." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { influence: 6 }, explanation: "You inspire a movement for educational reform." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { knowledge: 5 }, explanation: "You examine how education systems perpetuate colonial control." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5 }, explanation: "Your educational business model is challenged." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { influence: -5 }, explanation: "Educational reforms make your policies obsolete." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { influence: 5 }, explanation: "Your art critiques colonial education systems." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Rise of Globalization",
        description: "As the world becomes more interconnected, globalization spreads capitalist ideologies. Benjamin's critiques of capitalism in history suggest that true liberation requires challenging both past and contemporary economic systems.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: 6 }, explanation: "You thrive in the global capitalist system." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { knowledge: -6 }, explanation: "Global capitalism spreads ideologies that dilute your message." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { knowledge: 5 }, explanation: "You analyze the rise of global capitalism and its ties to colonialism." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 7 }, explanation: "You capitalize on the interconnected global market." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { influence: 6 }, explanation: "Your pro-globalization stance gains popularity." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { influence: -5 }, explanation: "Your anti-globalization art is marginalized." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Fight Over Historical Memory",
        description: "Benjamin's concept of historical materialism touches on how history is constructed. The fight over what is remembered and forgotten is central to decolonization, as former imperial powers attempt to suppress the truth.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { influence: -5 }, explanation: "Your historical version is being questioned." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { knowledge: 6 }, explanation: "You expose historical injustices and revisionism." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { knowledge: 6 }, explanation: "You contribute to the battle over historical memory." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5 }, explanation: "You lose customers to competing, more truthful narratives." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { influence: -6 }, explanation: "The public no longer trusts your version of history." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { influence: 5 }, explanation: "Your art reclaims suppressed histories." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Question of Reparations",
        description: "Césaire discusses reparations as a form of moral restitution for the atrocities committed during colonial rule. The fight for reparations is part of the decolonization process, with increasing calls for financial and cultural reparation.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -6, knowledge: -2, influence: -1 }, explanation: "You are forced to pay reparations for colonial harm." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 5 }, explanation: "Your advocacy for reparations gains widespread support." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 4, influence: 1 }, explanation: "You examine the legal and moral implications of reparations." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -1, influence: -1 }, explanation: "Your assets are redirected to pay reparations." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { influence: -5 }, explanation: "The public demands action on reparations." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { influence: 6 }, explanation: "Your work highlights the need for reparations." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Emergence of Transnational Movements",
        description: "Transnational movements rise in response to global struggles for justice. Tuck and Yang emphasize that decolonization isn't just a metaphor but a process rooted in global solidarity. Benjamin highlights the importance of the collective struggle against oppressive historical structures.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -2, influence: -1 }, explanation: "The international solidarity against your actions weakens your hold." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 5 }, explanation: "Your participation in the global movement gains recognition." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 4, influence: 1 }, explanation: "You document the growing transnational solidarity." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -1 }, explanation: "You're forced to reconsider international trade practices." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: -1, influence: 4 }, explanation: "Your policies are seen as part of a global movement." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 5 }, explanation: "Your work becomes a voice within transnational solidarity." }
        }
    },
    {
        deck: "End of Turn",
        name: "Neoliberalism's Global Ascendancy",
        description: "The rise of neoliberal policies shapes a new imperialism, where market-driven agendas replace colonial governance. Césaire and Benjamin critique the continuation of exploitation under the guise of market freedom.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: 5, knowledge: -1, influence: 2 }, explanation: "You thrive under the global neoliberal system." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -5, influence: -2 }, explanation: "Neoliberalism suppresses your revolutionary ideas." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 4, influence: 1 }, explanation: "You chronicle the growing influence of neoliberalism." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 6, knowledge: 1, influence: 1 }, explanation: "You capitalize on the expanding global market." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: -1, influence: 4 }, explanation: "You align with neoliberal policies for power." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: 0, influence: -4 }, explanation: "Your critical art is overshadowed by neoliberal agendas." }
        }
    },
    {
        deck: "End of Turn",
        name: "Rejection of Western Cultural Hegemony",
        description: "The rejection of Western cultural hegemony signals a return to indigenous knowledge and practices. Césaire's call for liberation and Barthes' emphasis on the collective over the individual creator align with this rejection.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -1, influence: -3 }, explanation: "Your cultural dominance is increasingly contested." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 5 }, explanation: "Your ideas about cultural liberation gain momentum." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 4, influence: 1 }, explanation: "You explore the roots of cultural resistance." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "Your market is disrupted by a new cultural wave." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -3 }, explanation: "You can't maintain control over the shifting cultural tide." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 1, influence: 5 }, explanation: "Your art is part of the reclamation of indigenous identity." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Rise of Postcolonial Criticism",
        description: "Postcolonial criticism emerges to question the authority of Western literary canons. Barthes and Césaire argue that history and literature should be rewritten by those who have been marginalized.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -2, influence: -1 }, explanation: "Your dominance in historical narrative is challenged." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: 2 }, explanation: "You study postcolonial criticism to strengthen your cause." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 0, knowledge: 4, influence: 1 }, explanation: "You delve into postcolonial literature and criticism." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "Your business is threatened by the rise of new perspectives." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -2, influence: -4 }, explanation: "Postcolonial movements gain traction and diminish your power." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 1, influence: 4 }, explanation: "Your work embodies postcolonial critique." }
        }
    },
    {
        deck: "End of Turn",
        name: "The Role of Technology in Postcolonial Movements",
        description: "The role of mass media and technology in the dissemination of postcolonial ideas is critical. Benjamin's notion of technology reshaping art's aura becomes a tool for activism.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -4 }, explanation: "You can't control the flow of information anymore." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 1, influence: 5 }, explanation: "You leverage technology to spread your revolutionary message." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 0 }, explanation: "You analyze the impact of technology on historical narratives." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 4, knowledge: 2, influence: 1 }, explanation: "You invest in tech that amplifies postcolonial movements." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -3 }, explanation: "You struggle to control technology's power." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 1, influence: 3 }, explanation: "Your art becomes widely circulated thanks to new technologies." }
        }
    },
    {
        deck: "End of Turn",
        name: "Indigenous Futurism Emerges",
        description: "Indigenous futurism reimagines technology and progress from indigenous perspectives. Benjamin's critique of linear progress and Césaire's call for new societies find expression in artistic and technological innovations that center indigenous worldviews.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -2, influence: -3 }, explanation: "Your technological dominance faces innovative challenges." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 4, influence: 3 }, explanation: "You integrate indigenous futurism into your vision." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 5, influence: 1 }, explanation: "You document emerging indigenous technological innovations." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -1, influence: -2 }, explanation: "Your tech company must adapt to new paradigms." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -3 }, explanation: "Your technological development policies appear outdated." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 4 }, explanation: "Your indigenous futurist art gains international acclaim." }
        }
    },
    {
        deck: "End of Turn",
        name: "Propaganda Wars Escalate",
        description: "The battle for hearts and minds intensifies as competing narratives circulate globally. Benjamin's critique of how media shapes public perception and Barthes' ideas about text and meaning intersect in this propaganda war.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -3 }, explanation: "Your propaganda loses effectiveness as competing narratives gain ground." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 4 }, explanation: "Your messaging resonates with growing anti-colonial sentiment." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 5, influence: 1 }, explanation: "You analyze the role of propaganda in shaping historical perceptions." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 1, influence: 2 }, explanation: "You profit from the increased demand for media technologies." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -4 }, explanation: "Your political messaging is undermined by sophisticated counter-narratives." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 4 }, explanation: "Your art cuts through propaganda to reveal underlying truths." }
        }
    },
    {
        deck: "End of Turn",
        name: "Rewriting Colonial Textbooks",
        description: "School curricula undergo dramatic revisions as colonial narratives are challenged. Tuck and Yang emphasize the importance of educational decolonization, while Césaire critiques how education has been used to perpetuate colonial ideologies.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -4, influence: -2 }, explanation: "Your historical narratives are removed from educational materials." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: 3 }, explanation: "Your perspective is increasingly included in educational reforms." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 4, influence: 2 }, explanation: "You contribute to the rewriting of more accurate historical texts." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -1, influence: -2 }, explanation: "Your educational publishing company must completely revise its content." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -4 }, explanation: "Your opposition to curriculum reform damages your reputation." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 3 }, explanation: "Your art is incorporated into new educational materials." }
        }
    },
    {
        deck: "End of Turn",
        name: "Oral Histories Gain Recognition",
        description: "Indigenous oral traditions and histories gain academic legitimacy. Benjamin's critique of written history and Barthes' deconstruction of authorship support the validation of non-written historical sources.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -3, influence: -3 }, explanation: "Your written historical records are challenged by oral accounts." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 3 }, explanation: "You incorporate oral histories into your movement's narrative." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 5, influence: 2 }, explanation: "You pioneer methods for documenting and analyzing oral histories." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -1, influence: -2 }, explanation: "Your business model based on written knowledge faces disruption." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -3 }, explanation: "Your dismissal of oral traditions alienates indigenous voters." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 3 }, explanation: "Your art draws upon and elevates oral traditional knowledge." }
        }
    },
    {   
        deck: "End of Turn",
        name: "Linguistic Decolonization Movements",
        description: "Endangered indigenous languages experience revival through grassroots efforts. Césaire explores how language loss is tied to cultural oppression, while Tuck and Yang emphasize language reclamation as central to decolonization.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -3, influence: -2 }, explanation: "Your linguistic hegemony is challenged by language revival efforts." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 4 }, explanation: "You support language reclamation as part of broader decolonization." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 5, influence: 1 }, explanation: "You document and analyze linguistic revival movements." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -1, influence: -2 }, explanation: "Your business faces costs to accommodate linguistic diversity." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -3 }, explanation: "Your 'official language' policies face increasing resistance." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 4 }, explanation: "Your multilingual art bridges cultural divides and promotes understanding." }
        }
    },
    {
        deck: "End of Turn",
        name: "University Curriculum Decolonization",
        description: "Academic institutions face pressure to decolonize their curricula and research practices. Tuck and Yang argue that true decolonization requires more than just diversifying reading lists, while Césaire critiques Western knowledge hierarchies.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -4, influence: -2 }, explanation: "Your academic influence diminishes as curricula diversify." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: 3 }, explanation: "Your ideas gain traction in academic institutions." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 4, influence: 2 }, explanation: "You help reshape historical scholarship with decolonial approaches." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -2 }, explanation: "Your academic publishing company must adapt to new scholarly demands." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -3 }, explanation: "Your attempts to control academic content face faculty resistance." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 4 }, explanation: "Your art is studied in newly reformed university courses." }
        }
    },
    {
        deck: "End of Turn",
        name: "Truth and Reconciliation Commissions",
        description: "Truth commissions form to address historical injustices. Benjamin's concept of redemptive history and Césaire's demands for accountability merge in these formal processes of reckoning with colonial legacies.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -2, influence: -4 }, explanation: "Your role in historical atrocities is exposed through testimony." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 4 }, explanation: "Your advocacy for truth-telling is validated by commission findings." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 6, influence: 2 }, explanation: "You gain unprecedented access to historical documents and testimony." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -3 }, explanation: "Your company faces reparation demands for historical complicity." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -4 }, explanation: "Your resistance to the commission damages your credibility." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 5 }, explanation: "Your art memorializes testimonies from the commission." }
        }
    },
    {
        deck: "End of Turn",
        name: "Intercultural Dialogue Initiatives",
        description: "Global forums for intercultural dialogue emerge to address historical wounds. Barthes' emphasis on the reader's role in creating meaning parallels these attempts to foster understanding across cultural divides.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -3 }, explanation: "Your perspective is increasingly marginalized in global forums." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 3 }, explanation: "You gain international platforms for your decolonial message." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 2 }, explanation: "You facilitate cross-cultural historical understanding." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 1, influence: 1 }, explanation: "Your multicultural consulting services gain international clients." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 1, influence: 3 }, explanation: "Your diplomatic efforts improve through cultural sensitivity training." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 4 }, explanation: "Your art transcends cultural boundaries and fosters dialogue." }
        }
    },
    {
        deck: "End of Turn",
        name: "Colonial Architecture Reconsidered",
        description: "Colonial buildings and urban layouts face recontextualization. Benjamin's analysis of architecture as political expression and Césaire's critique of colonial space connect to debates about preserving or transforming colonial structures.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "Your architectural symbols of dominance are reinterpreted or removed." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 4 }, explanation: "You transform colonial spaces into sites of resistance and memory." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: 1 }, explanation: "You analyze how colonial power was expressed through architecture." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 1, influence: 1 }, explanation: "Your firm profits from architectural redesign and recontextualization projects." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -3 }, explanation: "Your defense of colonial architecture without context alienates voters." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 4 }, explanation: "Your installations reimagine and reclaim colonial architectural spaces." }
        }
    },
    {
        deck: "End of Turn",
        name: "Digital Colonialism Emerges",
        description: "A new form of colonialism arises through digital technology and data extraction. Benjamin's critique of technological reproduction finds new relevance as digital platforms extend Western dominance.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: 5, knowledge: 3, influence: 4 }, explanation: "Your digital platforms extract data globally." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -3, influence: -4 }, explanation: "Your movement struggles against algorithmic suppression." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 4, influence: 0 }, explanation: "You document the rise of digital colonialism." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: 6, knowledge: 3, influence: 2 }, explanation: "Your tech company profits from global data extraction." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: -1, influence: 3 }, explanation: "You partner with tech giants for political advantage." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: 2, influence: -3 }, explanation: "Your critique of digital colonialism is algorithmically suppressed." }
        }
    },
    {
        deck: "End of Turn",
        name: "Land Reclamation Movements",
        description: "Indigenous communities fight to reclaim ancestral lands. Tuck and Yang emphasize that decolonization must include the return of land, not just metaphorical gestures of inclusion.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -6, knowledge: -2, influence: -1 }, explanation: "Your land holdings face legal challenges and occupation." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 5 }, explanation: "You organize successful land reclamation campaigns." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 4, influence: 1 }, explanation: "You document land theft and reclamation efforts." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -1, influence: -2 }, explanation: "Your developments on contested land are halted." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -3 }, explanation: "Land rights disputes undermine your political standing." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 4 }, explanation: "Your art highlights the importance of land reclamation." }
        }
    },
    {
        deck: "End of Turn",
        name: "Food Sovereignty Movements",
        description: "Communities resist agricultural imperialism and fight for food sovereignty. Césaire links colonial control of agriculture to economic exploitation, while Benjamin sees industrial agriculture as part of capitalism's environmental devastation.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -1, influence: -3 }, explanation: "Your agribusiness monopolies face resistance." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 4 }, explanation: "You build alternative food systems and seed banks." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 4, influence: 1 }, explanation: "You document the impact of agricultural colonialism." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "Your industrial farming model loses market share." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -3 }, explanation: "Your agricultural subsidies for corporations face backlash." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 4 }, explanation: "Your art celebrates indigenous farming practices." }
        }
    },
    {
        deck: "End of Turn",
        name: "Intellectual Property and Biopiracy",
        description: "The appropriation of indigenous knowledge through intellectual property laws faces resistance. Tuck and Yang critique the continued extraction of resources, including knowledge, from indigenous communities.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -2, influence: -3 }, explanation: "Your patents on indigenous knowledge are invalidated." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 4, influence: 3 }, explanation: "You campaign against biopiracy and knowledge extraction." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 5, influence: 1 }, explanation: "You document cases of intellectual property theft." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -1, influence: -2 }, explanation: "Your company faces lawsuits over appropriated knowledge." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -3 }, explanation: "Your intellectual property laws face international criticism." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 3 }, explanation: "Your art criticizes the commodification of knowledge." }
        }
    },
    {
        deck: "End of Turn",
        name: "Colonial Tourism Criticized",
        description: "Tourism that exploits colonial nostalgia or exoticizes formerly colonized cultures faces criticism. Benjamin's critique of authenticity in the age of mechanical reproduction applies to the tourism industry's packaging of 'authentic' cultural experiences.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -1, influence: -4 }, explanation: "Your colonial tourism ventures lose popularity." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 4 }, explanation: "You organize against exploitative tourism practices." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 4, influence: 1 }, explanation: "You analyze how tourism perpetuates colonial narratives." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "Your tourism business model requires ethical restructuring." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -3 }, explanation: "Your promotion of colonial tourism sites backfires." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 2, influence: 3 }, explanation: "Your art subverts the colonial tourist gaze." }
        }
    },
    {
        deck: "End of Turn",
        name: "Financial Colonialism Contested",
        description: "International financial institutions that perpetuate economic dependency face resistance. Césaire's critique of economic exploitation under colonialism extends to contemporary debt structures that limit sovereignty.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -2, influence: -4 }, explanation: "Your financial control mechanisms are exposed and resisted." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 4, influence: 4 }, explanation: "You organize successful debt forgiveness campaigns." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: 2 }, explanation: "You document how financial instruments perpetuate colonial power." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -2, influence: -3 }, explanation: "Your investment in exploitative financial mechanisms backfires." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -2, influence: -4 }, explanation: "Your support for predatory lending faces public outrage." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 4 }, explanation: "Your art exposes financial colonialism's global impact." }
        }
    },
    {
        deck: "End of Turn",
        name: "Climate Justice Demands",
        description: "Climate justice movements connect environmental degradation to colonial history and demand reparations. Benjamin's critique of progress finds new relevance as industrial development threatens planetary survival.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -6, knowledge: -3, influence: -4 }, explanation: "Your high-emissions industries face regulation and protests." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 3, influence: 5 }, explanation: "Your climate justice movement gains international support." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 5, influence: 1 }, explanation: "You connect climate change to colonial resource extraction." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -3 }, explanation: "Your carbon-intensive business model becomes a liability." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -2, influence: -4 }, explanation: "Your climate inaction mobilizes voters against you." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 5 }, explanation: "Your climate art inspires global activism." }
        }
    },
    {
        deck: "End of Turn",
        name: "Indigenous Knowledge Systems Resurge",
        description: "Indigenous knowledge systems, long suppressed by colonialism, resurface and gain recognition. Tuck and Yang discuss the importance of reclaiming indigenous epistemologies as part of decolonization.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -4, influence: -5 }, explanation: "Your knowledge systems are increasingly delegitimized." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 5, influence: 4 }, explanation: "You integrate indigenous knowledge into your movement." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 6, influence: 2 }, explanation: "You document the revival of indigenous knowledge systems." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -2, influence: -2 }, explanation: "Your products based on Western ideas lose market share." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -2, influence: -3 }, explanation: "Your political authority built on Western ideals is questioned." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 4, influence: 5 }, explanation: "Your art celebrates indigenous knowledge and perspectives." }
        }
    },
    {
        deck: "End of Turn",
        name: "Colonial Languages Contested",
        description: "The dominance of colonial languages in education and governance is challenged. Césaire, writing in French despite critiquing French colonialism, embodies the complex relationship between language and decolonization.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -3, influence: -3 }, explanation: "Your linguistic dominance is eroding." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 4 }, explanation: "You champion multilingualism and indigenous languages." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 4, influence: 1 }, explanation: "You study the role of language in colonial control." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -1, influence: -2 }, explanation: "Your monolingual business model faces challenges." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -4 }, explanation: "Language policy disputes impact your political standing." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 3 }, explanation: "Your multilingual art bridges communities." }
        }
    },
    {
        deck: "End of Turn",
        name: "Environmental Justice Movements Emerge",
        description: "Environmental justice movements link colonial exploitation to ecological devastation. Césaire's critique of exploitation extends to the natural world, while Benjamin's vision of progress questions the environmental cost of capitalism.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -6, knowledge: -3, influence: -4 }, explanation: "Your resource extraction practices face fierce opposition." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 3, knowledge: 4, influence: 4 }, explanation: "You connect environmental and decolonial struggles." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 5, influence: 2 }, explanation: "You document the environmental impact of colonialism." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -2, influence: -3 }, explanation: "Environmental regulations impact your profits." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -2, influence: -4 }, explanation: "Your pro-development stance loses public support." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 3, influence: 5 }, explanation: "Your environmental art inspires activism." }
        }
    },
    {
        deck: "End of Turn",
        name: "Religious Colonialism Confronted",
        description: "Religious institutions that supported colonialism face growing criticism. Césaire highlights how Christianity was weaponized to justify conquest, while Benjamin critiques the religious notion of progress.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -2, influence: -3 }, explanation: "Religious justifications for colonialism lose credibility." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 4 }, explanation: "You expose the role of religion in colonial oppression." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 5, influence: 1 }, explanation: "You document religious institutions' complicity in colonialism." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -1, influence: -2 }, explanation: "Religious consumers boycott your products." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -4 }, explanation: "Your religious-based policies face secular opposition." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 3 }, explanation: "Your art critically examines religious colonialism." }
        }
    },
    {
        deck: "End of Turn",
        name: "Borders and Migration Crises",
        description: "Colonial borders create migration crises as people flee economic exploitation and political instability. Césaire links migration to the ongoing effects of colonialism, while Benjamin sees borders as part of the 'state of emergency' that is the norm for the oppressed.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -2, influence: -3 }, explanation: "Your border enforcement becomes increasingly costly." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 4 }, explanation: "Your movement supports migrants' rights." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 5, influence: 1 }, explanation: "You trace how colonial borders created current crises." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -4, knowledge: -1, influence: -2 }, explanation: "Labor shortages impact your business operations." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -1, influence: -4 }, explanation: "Your immigration policies face humanitarian criticism." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 2, influence: 5 }, explanation: "Your art highlighting migrant experiences gains recognition." }
        }
    },
    {
        deck: "End of Turn",
        name: "Medical Colonialism Exposed",
        description: "The exploitation of colonized populations for medical research and the imposition of Western medical systems over indigenous healing practices comes under scrutiny. Césaire critiques the dehumanization that enables such exploitation.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -4, influence: -3 }, explanation: "Your medical experimentation programs face legal action." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 4, influence: 4 }, explanation: "You advocate for medical sovereignty and reparations." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: 5, influence: 1 }, explanation: "You document medical abuses in colonial contexts." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -5, knowledge: -2, influence: -2 }, explanation: "Your pharmaceutical company faces boycotts over unethical practices." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -2, knowledge: -2, influence: -4 }, explanation: "Medical sovereignty movements challenge your authority." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 3, influence: 4 }, explanation: "Your art exposes medical colonialism's ongoing impact." }
        }
    },
    {
        deck: "End of Turn",
        name: "Archives of Resistance Uncovered",
        description: "Hidden archives documenting resistance to colonialism are discovered and made public. Benjamin argues for the importance of uncovering subjugated histories, while Césaire emphasizes how colonial powers systematically erased evidence of resistance.",
        effects: {
            Colonialist:   { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -3, influence: -4 }, explanation: "Your narrative of peaceful colonization is undermined by historical evidence." },
            Revolutionary: { type: 'RESOURCE_CHANGE', changes: { money: 1, knowledge: 6, influence: 3 }, explanation: "You draw inspiration and tactics from historical resistance movements." },
            Historian:     { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 5, influence: 2 }, explanation: "Your scholarly work is enhanced by newly available primary sources." },
            Entrepreneur:  { type: 'RESOURCE_CHANGE', changes: { money: -3, knowledge: -1, influence: -2 }, explanation: "Your business faces scrutiny for historical connections to suppressed resistance." },
            Politician:    { type: 'RESOURCE_CHANGE', changes: { money: -1, knowledge: -2, influence: -3 }, explanation: "Your political platform is challenged by historical revelations." },
            Artist:        { type: 'RESOURCE_CHANGE', changes: { money: 2, knowledge: 4, influence: 3 }, explanation: "Your art draws from newly discovered resistance narratives and symbols." }
        }
    }
];

export const END_OF_TURN_DECK = endOfTurnDeck;