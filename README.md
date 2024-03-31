Project is based on Track submission for ETHSeoul 2024 under FHENIX track
Contract deployed: https://explorer.testnet.fhenix.zone/address/0xc7603D73A56F5bb4849cAA963032d8f350616C45

We are creating a Dating app that enables user to identify individuals with STD based on medical data that is encrypted using Fully Homomorphic Encryption (FHE) on chain.

This would ensure both party privacy and health safety

Types of Data onchain that is encrypted using FHE:
- User Date of Birth (Checking if a user is above the age of 18 is public [returns true/false])
- User Medical Data (stored using 0=not checked, 1 = clean, 2 = HIV Positive, 3 = Possess a common STD... up to 255 combination to save on storage space)
- User Criminal Record (0 = no criminal record, 1 = Been to prison, 2 = Sexual Offender...)
- User Fertility Measure (0 = not checked, 1-100 checked by the doctor rating? was a suggestion given by other individuals)
- User Marriage status (0 = Single, 1 = Married, 2 = Widowed, 3 = Divorcee)
- User Rating (Social Credit Score? App Rating? uty to define the rating 0-100)
- Last Medical Examine date (Ensures that the data provided is recent)

Medical data can only be provided by approved Admins (Doctors/institutions)
Viewing of user data would require the user to grant approval to a wallet to call for viewing of their data, else view function would revert (Similar to Allowance concept but for view)


Deployment Script:
![image](https://github.com/0xjunwei/ETHSeoul2024/assets/53926665/17391e5a-b4ec-47ed-a0d5-2865783ce6c5)
Test script:
![image](https://github.com/0xjunwei/ETHSeoul2024/assets/53926665/2c2fcbfe-24b5-47e0-8325-d4b84596c6b2)


