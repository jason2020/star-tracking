import { useState, useEffect } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  MantineProvider,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons";
import Star from "./Star";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
    width: "auto",
  },

  thinTh: {
    padding: "0 !important",
    width: "15%",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

interface Stars {
  description: string;
  date: Date;
}

interface RowData {
  name: string;
  stars: Stars[];
  ranking: string;
}

interface TableSortProps {
  data: RowData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
  normalWidth: boolean;
}

function Th({ children, reversed, sorted, onSort, normalWidth }: ThProps) {
  const { classes } = useStyles();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setWidth]);

  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <MantineProvider
      theme={{
        fontFamily: "Press Start 2P",
      }}
    >
      <th className={normalWidth || width < 700 ? classes.th : classes.thinTh}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="apart">
            <Text weight={500} size="sm">
              {children}
            </Text>
            <Center className={classes.icon}>
              <Icon size={14} stroke={1.5} />
            </Center>
          </Group>
        </UnstyledButton>
      </th>
    </MantineProvider>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) => item.name.toLowerCase().includes(query));
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      // eslint-disable-next-line valid-typeof
      if (typeof a[sortBy] !== "string") {
        if (payload.reversed) {
          return b[sortBy].length > a[sortBy].length ? -1 : 1;
        } else {
          return b[sortBy].length > a[sortBy].length ? 1 : -1;
        }
      }

      if (payload.reversed) {
        return (b[sortBy] as string).localeCompare(a[sortBy] as string);
      }

      return (a[sortBy] as string).localeCompare(b[sortBy] as string);
    }),
    payload.search
  );
}

export function StarTable({ data }: TableSortProps) {
  useEffect(() => {
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search })
    );
  }, [data]);

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const rows = sortedData.map((row) => (
    <tr key={row.name}>
      <td>{row.ranking}</td>
      <td>{row.name}</td>
      <td>
        {row.stars.map((star, index) => (
          <Star key={index} description={star.description} date={star.date} />
        ))}
      </td>
    </tr>
  ));
  return (
    <ScrollArea>
      <TextInput
        placeholder="Name"
        size="md"
        icon={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: 0 }}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: "fixed" }}
        highlightOnHover
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === "ranking"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("ranking")}
              normalWidth={false}
            >
              Ranking
            </Th>
            <Th
              sorted={sortBy === "name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("name")}
              normalWidth={true}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === "stars"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("stars")}
              normalWidth={true}
            >
              Stars
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 || !data[0] ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
