#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<math.h>

#define MAX_BITS 15
#define ALPHABET_SIZE 2

#define CHAR_TO_INDEX(c) ((int)c - (int)'0')

struct TrieNode {
     struct TrieNode *children[ALPHABET_SIZE];
     int isEndOfWord;
     int count;
     char val;
     int level;
};

struct TrieNode *getNode(void) {
    struct TrieNode *pNode = NULL;

    pNode = (struct TrieNode *)malloc(sizeof(struct TrieNode));

    if (pNode) {
        pNode->isEndOfWord = 0;
        pNode->count = 0;

        for (int i = 0; i < ALPHABET_SIZE; i++)
            pNode->children[i] = NULL;
    }

    return pNode;
}

void insert(struct TrieNode* root, char* word) {
    int length = strlen(word);
    int index;
    struct TrieNode *node = root;

    for (int level = 0; level < length; level++) {
        index = CHAR_TO_INDEX(word[level]);
        if (!node->children[index])
            node->children[index] = getNode();

        node->children[index]->count++;
        node->children[index]->val = word[level];
        node->children[index]->level = level;
        node = node->children[index];
    }

    node->isEndOfWord = 1;
}

int search(struct TrieNode *root, const char *key) {
    int level;
    int length = strlen(key);
    int index;
    struct TrieNode *pCrawl = root;

    for (level = 0; level < length; level++)
    {
        index = CHAR_TO_INDEX(key[level]);

        if (!pCrawl->children[index])
            return 0;

        pCrawl = pCrawl->children[index];
    }

    return (pCrawl->isEndOfWord);
}

int searchCount(struct TrieNode *root, const char *key) {
    int length = strlen(key);
    int index;
    struct TrieNode *pCrawl = root;

    for (int level = 0; level < length; level++) {
        index = CHAR_TO_INDEX(key[level]);

        if (!pCrawl->children[index])
            return -1;

        pCrawl = pCrawl->children[index];
    }

    return (pCrawl->count);
}

struct TrieNode* searchNode(struct TrieNode *root, const char *key) {
    int length = strlen(key);
    int index;
    struct TrieNode *pCrawl = root;

    for (int level = 0; level < length; level++) {
        index = CHAR_TO_INDEX(key[level]);

        if (!pCrawl->children[index])
            return -1;

        pCrawl = pCrawl->children[index];
    }

    return pCrawl;
}

void countReport(char* report, int reportSize, int* bitCount) {
    for(int i=0; i < reportSize; i++) {
        if ( report[i] == '1' )
            bitCount[i]++;
        else
            bitCount[i]--;
    }
}

void searchComplete(struct TrieNode *root, char *prefix) {
    int level;
    int length = strlen(prefix);
    int index;
    struct TrieNode *pCrawl = root;

    for (level = 0; level < length; level++) {
        index = CHAR_TO_INDEX(prefix[level]);
        pCrawl = pCrawl->children[index];
    }

    while (!pCrawl->isEndOfWord) {
        if ( pCrawl->children[0] ) {
            prefix[level++] = '0';
            pCrawl = pCrawl->children[0];
        } else {
            prefix[level++] = '1';
            pCrawl = pCrawl->children[1];
        }
    }

    prefix[level] = '\0';
}

int binary_to_decimal(char* binary, int len) {
    int dec = 0;
    int temp;
    for(int i=0; i < len; i++) {
        temp = binary[len-i-1] == '1' ? pow(2, i) : 0;
        dec += temp;
    }

    return dec;
}


int main() {
	FILE *fp = fopen("input.txt", "r" );
	char report[MAX_BITS];
	int bitCount[MAX_BITS];
	int bitsSize;
	char gamma[MAX_BITS];
	char epsilon[MAX_BITS];
	char tempRating[MAX_BITS];
	int tempCount;
	int oxygenDec;
	int co2Dec;

	fscanf(fp, "%s", report);
	bitsSize = strlen(report);

	struct TrieNode* root = getNode();

	for(int i=0; i < bitsSize; i++)
        bitCount[i] = 0;

	countReport(report, bitsSize, &bitCount);
	insert(root, report);

	while ( fscanf(fp, "%s", report) == 1 ) {
        countReport(report, bitsSize, &bitCount);
        insert(root, report);
	}

	for(int i=0; i < bitsSize; i++) {
        printf(" %d ", bitCount[i]);
        if ( bitCount[i] > 0 ) {
            gamma[i] = '1';
            epsilon[i] = '0';
        } else {
            gamma[i] = '0';
            epsilon[i] = '1';
        }
	}
	printf("\n");

	for(int i=0; i < bitsSize; i++) {
        printf(" %c ", gamma[i]);
	}
	printf("\n");

	for(int i=0; i < bitsSize; i++) {
        printf(" %c ", epsilon[i]);
	}
	printf("\n");

    gamma[bitsSize] = '\0';
    epsilon[bitsSize] = '\0';

    // search for retings
    for(int i=0; i < bitsSize; i++) {
        tempRating[i] = gamma[i];
        tempRating[i+1] = '\0';

        //printf(" gamma %s \n", gamma);
        //printf(" tempRating %s \n", tempRating);

        tempCount = searchCount(root, tempRating);

        // found the unique sub string
        if (tempCount == 1) {
            printf("%s\n", tempRating);
            searchComplete(root, tempRating);
            printf("%s\n", tempRating);
            oxygenDec = binary_to_decimal(tempRating, bitsSize);
            break;
        } else {
            struct TrieNode *n = searchNode(root, tempRating);
            int child0 = n->children[0] ? n->children[0]->count : 0;
            int child1 = n->children[1] ? n->children[1]->count : 0;

            printf(" c[0]: %d   c[1]: %d \n", child0, child1);

            if (child0 > child1)
                gamma[i+1] = '0';
            else
                gamma[i+1] = '1';
        }
    }

    for(int i=0; i < bitsSize; i++) {
        tempRating[i] = epsilon[i];
        tempRating[i+1] = '\0';

        //printf(" epsilon %s \n", epsilon);
        //printf(" tempRating %s \n", tempRating);

        tempCount = searchCount(root, tempRating);

        // found the unique sub string
        if (tempCount == 1) {
            printf("%s\n", tempRating);
            searchComplete(root, tempRating);
            printf("%s\n", tempRating);
            co2Dec = binary_to_decimal(tempRating, bitsSize);
            break;
        } else {
            struct TrieNode *n = searchNode(root, tempRating);
            int child0 = n->children[0] ? n->children[0]->count : 0;
            int child1 = n->children[1] ? n->children[1]->count : 0;

            printf(" c[0]: %d   c[1]: %d \n", child0, child1);

            if (child1 < child0)
                epsilon[i+1] = '1';
            else
                epsilon[i+1] = '0';
        }
    }

    printf("Final Pos: oxygen %d | co2: %d \n", oxygenDec, co2Dec);
    printf("Response: %d \n", oxygenDec * co2Dec);

//    struct TrieNode *queue[4099];
//    queue[0] = root;
//    int queueSize = 1;
//    int level = 0;
//    while (queueSize > 0) {
//        struct TrieNode *node = queue[0];
//        for (int i=1; i < queueSize; i++)
//            queue[i-1] = queue[i];
//        queueSize--;
//
//        printf("lvl: %d v: %c Node: %d Child[0]: %d Child[1]: %d -> Count %d isEnd: %d \n", node->level, node->val, node, node->children[0], node->children[1], node->count, node->isEndOfWord);
//
//        if ( node->children[0] ) {
//            queue[queueSize] = node->children[0];
//            queueSize++;
//        }
//
//        if ( node->children[1] ) {
//            queue[queueSize] = node->children[1];
//            queueSize++;
//        }
//    }

	fclose( fp );

	return 0;
}
