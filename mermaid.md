```mermaid
flowchart TB
    A[Home page] --> B{Is logged in}
    B --->|No| C{Authentication}
    C ---> D[Log In]
    C ---> E[Sign up]
    B --->|Yes| F[Welcome Page]
    F ---> G{\n\n\n\n\n\n\n\n}
    D --->F
    E --->F
    G ---> H[Create question]
    G ---> I[Access question]
    H ---> J[View question]
    I ---> 1{Is author}
    1 --->|YES|2[Edit question]
    1 --->|YES|3[Give rank to answer]
    1 --->|NO|4[Post answer]
    1 --->|NO|8[Delete answer]
    1 --->|NO|5[Give suggestion to answer]
    J ---> 2
    J ---> 3
    G ---> 6[Disconnect]
    6 ---> A
    D --->|Bad credentials|C
    E --->|Username is already in use|C
    I --->|Question not found|G
    H --->|Fields not filled|G
    H --->|Title too long|G
    2 ---> |Title too long|7{\n\n\n}
    2 ---> |Fields not filled|7
    
```